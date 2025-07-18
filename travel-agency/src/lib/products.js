import { supabase } from './supabase.js'

// 랜덤 10자리 product_number 생성 함수
function getRandomProductNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 모든 출발장소 조회
 * @returns {Promise<{success: boolean, startingPoints: Array, error?: string}>}
 */
export async function getAllStartingPoints() {
  try {
    const { data, error } = await supabase
      .from('StartingPoints')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    
    return { success: true, startingPoints: data || [] };
  } catch (error) {
    return { success: false, startingPoints: [], error: error.message };
  }
}

/**
 * Supabase Storage에 상품 이미지 업로드
 * @param {File[]} files - 업로드할 이미지 파일 배열
 * @param {string} productNumber - product_number (폴더명)
 * @returns {Promise<{success: boolean, urls?: string[], error?: string}>}
 */
export async function uploadProductImages(files, productNumber) {
  try {
    if (!files || !files.length) return { success: false, error: '이미지 파일이 없습니다.' };
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = i === 0 ? 'main' : String(i);
      const path = `${productNumber}/${fileName}`;
      const { error } = await supabase.storage.from('products').upload(path, file, { upsert: true });
      if (error) throw error;
      // publicUrl 구하기
      const { data } = supabase.storage.from('products').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return { success: true, urls };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 인기 투어 상품 리스트를 가져온다. -> 6개만
 * @returns {Promise<{success: boolean, tours: Array, error?: string}>}
 */
export async function getPopularTours() {
  try {
    // Products에서 duration, location(id) 포함, location은 Locations 테이블과 조인
    // status가 true인 활성 상품만 조회
    const { data, error } = await supabase
      .from('Products')
      .select(`
        id, 
        title, 
        subtitle, 
        main_image_url, 
        adult_price, 
        child_price, 
        duration, 
        location_id,
        location:location_id(id, name), 
        badge_id,
        badge:badge_id(id, name)
      `)
      .eq('status', true)
      .order('created_at', { ascending: false })
      .limit(6)
    if (error) throw error

    console.log('getPopularTours raw data:', data)

    // 더미 데이터 형식에 맞게 매핑
    const tours = (data || []).map((item, idx) => {
      console.log(`Tour ${idx}:`, item)
      return {
        id: item.id,
        title: item.title || '',
        description: item.subtitle || '',
        duration: item.duration || '',
        location: item.location?.name || '지역 미정',
        price: item.adult_price || 0,
        badge: item.badge?.name || '',
        image: item.main_image_url || ''
      }
    })

    console.log('getPopularTours mapped tours:', tours)
    return { success: true, tours }
  } catch (error) {
    console.error('getPopularTours error:', error)
    return { success: false, tours: [], error: error.message }
  }
}

/**
 * 특정 상품 상세 정보 조회 (프론트 요구 mockData 구조)
 * @param {number} productId
 * @returns {Promise<{success: boolean, product?: object, error?: string}>}
 */
export async function getProductDetail(productId) {
  try {
    const { data, error } = await supabase
      .from('Products')
      .select(`
        id,
        title,
        subtitle,
        main_image_url,
        product_code,
        product_number,
        duration,
        event_content,
        adult_price,
        child_price,
        included_items,
        excluded_items,
        likely_departure_threshold,
        confirmed_departure_threshold,
        category:category_id(id, name)
      `)
      .eq('id', productId)
      .eq('status', true)
      .single()
    if (error) throw error

    // ProductImages에서 해당 product_id의 이미지 가져오기
    const { data: imagesData, error: imagesError } = await supabase
      .from('ProductImages')
      .select('image_url')
      .eq('product_id', productId);
    if (imagesError) throw imagesError;

    const images = [
      ...(data.main_image_url ? [data.main_image_url] : []),
      ...((imagesData || []).map(img => img.image_url))
    ];

    const product = {
      id: data.id,
      category: data.category?.name || '',
      title: data.title || '',
      subtitle: data.subtitle || '',
      mainImage: data.main_image_url || '',
      productCode: data.product_code || '',
      productNumber: data.product_number || '',
      travelDuration: data.duration || '',
      eventContent: data.event_content || '',
      adultPrice: data.adult_price || 0,
      childPrice: data.child_price || 0,
      includedItems: data.included_items || '',
      excludedItems: data.excluded_items || '',
      likelyDepartureThreshold: data.likely_departure_threshold || 30,
      confirmedDepartureThreshold: data.confirmed_departure_threshold || 50,
      meetingPoint: '', // Products 테이블에 meeting_point 없음. 필요시 location 조인 등으로 확장 가능
      images
    }

    return { success: true, product }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 특정 카테고리의 상품 전체 조회
 * @param {number} categoryId
 * @param {number} tagId - 선택적 서브카테고리 ID
 * @param {string} sortBy - 정렬 기준 ('latest', 'price-low', 'price-high', 'popular')
 * @returns {Promise<{success: boolean, products: Array, error?: string}>}
 */
export async function getProductsByCategory(categoryId, tagId = null, sortBy = 'latest') {
  try {
    let query = supabase
      .from('Products')
      .select('id, title, subtitle, main_image_url, adult_price, child_price, duration, tag_id, location:location_id(id, name), badge:badge_id(id, name)')
      .eq('category_id', categoryId)
      .eq('status', true)
    
    // 서브카테고리(태그) 필터링
    if (tagId) {
      query = query.eq('tag_id', tagId)
    }
    
    // 정렬 처리
    switch (sortBy) {
      case 'latest':
        query = query.order('created_at', { ascending: false })
        break
      case 'price-low':
        query = query.order('adult_price', { ascending: true })
        break
      case 'price-high':
        query = query.order('adult_price', { ascending: false })
        break
      case 'popular':
        // 인기순은 조회수나 예약수 기준으로 정렬 (현재는 ID 기준)
        query = query.order('id', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }
    
    const { data, error } = await query
    if (error) throw error

    const products = (data || []).map(item => ({
      id: item.id,
      title: item.title || '',
      description: item.subtitle || '',
      duration: item.duration || '',
      location: item.location?.name || '',
      price: item.adult_price || 0,
      badge: item.badge?.name || '',
      image: item.main_image_url || '',
      tagId: item.tag_id
    }))

    return { success: true, products }
  } catch (error) {
    return { success: false, products: [], error: error.message }
  }
}

/**
 * 상품 검색 API
 * @param {string} keyword
 * @returns {Promise<{success: boolean, products: Array, error?: string}>}
 */
export async function searchProducts(keyword) {
  try {
    // 1차: Products의 텍스트 필드만 or 검색 (status가 true인 활성 상품만)
    const { data, error } = await supabase
      .from('Products')
      .select(`
        id,
        title,
        subtitle,
        main_image_url,
        adult_price,
        child_price,
        duration,
        event_content,
        location:location_id(id, name),
        badge:badge_id(id, name)
      `)
      .eq('status', true)
      .or([
        `title.ilike.%${keyword}%`,
        `subtitle.ilike.%${keyword}%`,
        `event_content.ilike.%${keyword}%`,
        `duration.ilike.%${keyword}%`
      ].join(','))

    if (error) throw error

    // 2차: location.name도 프론트에서 필터링
    const products = (data || []).filter(item =>
      item.location?.name?.includes(keyword) ||
      item.title?.includes(keyword) ||
      item.subtitle?.includes(keyword) ||
      item.event_content?.includes(keyword) ||
      item.duration?.includes(keyword)
    ).map(item => ({
      id: item.id,
      title: item.title || '',
      description: item.subtitle || '',
      duration: item.duration || '',
      location: item.location?.name || '',
      price: item.adult_price || 0,
      badge: item.badge?.name || '',
      image: item.main_image_url || ''
    }))

    return { success: true, products }
  } catch (error) {
    return { success: false, products: [], error: error.message }
  }
}

/**
 * 상품 추가(등록) + 이미지 업로드 + 출발장소 지원
 * @param {object} productData - 등록할 상품 정보 (images: File[], startingPoints: Array 포함 가능)
 * @returns {Promise<{success: boolean, id?: number, error?: string}>}
 */
export async function createProduct(productData) {
  try {
    // 1. product_number 생성
    const productNumber = getRandomProductNumber();
    
    // 2. 이미지 업로드 (images: File[])
    let mainImageUrl = '';
    let imageUrls = [];
    if (productData.images && productData.images.length) {
      const uploadResult = await uploadProductImages(productData.images, productNumber);
      if (!uploadResult.success) throw new Error(uploadResult.error);
      mainImageUrl = uploadResult.urls[0];
      imageUrls = uploadResult.urls.slice(1);
    }
    
    // 3. Products 테이블에 등록
    const insertData = {
      ...productData,
      product_number: productNumber,
      main_image_url: mainImageUrl,
    };
    delete insertData.images;
    delete insertData.startingPoints;
    
    const { data, error } = await supabase
      .from('Products')
      .insert([insertData])
      .select('id')
      .single();
    if (error) throw error;
    
    // 4. ProductImages 테이블에 나머지 이미지 저장
    if (imageUrls.length) {
      const imagesToInsert = imageUrls.map(url => ({ product_id: data.id, image_url: url }));
      const { error: imgError } = await supabase.from('ProductImages').insert(imagesToInsert);
      if (imgError) throw imgError;
    }
    
    // 5. ProductStartingPoints 테이블에 출발장소 저장
    if (productData.startingPoints && productData.startingPoints.length) {
      const startingPointsToInsert = productData.startingPoints.map(sp => ({
        product_id: data.id,
        starting_point_id: sp.starting_point_id,
        time: sp.time
      }));
      const { error: spError } = await supabase.from('ProductStartingPoints').insert(startingPointsToInsert);
      if (spError) throw spError;
    }
    
    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 상품 수정 API
 * @param {number} productId - 수정할 상품 ID
 * @param {object} productData - 수정할 상품 정보
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateProduct(productId, productData) {
  try {
    // 이미지 업로드 처리
    let mainImageUrl = '';
    let imageUrls = [];
    
    if (productData.images && productData.images.length) {
      // 기존 product_number 가져오기
      const { data: existingProduct, error: fetchError } = await supabase
        .from('Products')
        .select('product_number')
        .eq('id', productId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const uploadResult = await uploadProductImages(productData.images, existingProduct.product_number);
      if (!uploadResult.success) throw new Error(uploadResult.error);
      mainImageUrl = uploadResult.urls[0];
      imageUrls = uploadResult.urls.slice(1);
    }
    
    // Products 테이블 업데이트
    const updateData = {
      ...productData,
      main_image_url: mainImageUrl || productData.main_image_url,
    };
    delete updateData.images;
    delete updateData.startingPoints;
    
    const { error } = await supabase
      .from('Products')
      .update(updateData)
      .eq('id', productId);
    
    if (error) throw error;
    
    // ProductImages 테이블 업데이트 (기존 이미지 삭제 후 새로 추가)
    if (imageUrls.length > 0) {
      // 기존 이미지 삭제
      const { error: deleteError } = await supabase
        .from('ProductImages')
        .delete()
        .eq('product_id', productId);
      
      if (deleteError) throw deleteError;
      
      // 새 이미지 추가
      const imagesToInsert = imageUrls.map(url => ({ product_id: productId, image_url: url }));
      const { error: imgError } = await supabase.from('ProductImages').insert(imagesToInsert);
      if (imgError) throw imgError;
    }
    
    // ProductStartingPoints 테이블 업데이트
    if (productData.startingPoints) {
      // 기존 출발장소 삭제
      const { error: deleteSpError } = await supabase
        .from('ProductStartingPoints')
        .delete()
        .eq('product_id', productId);
      
      if (deleteSpError) throw deleteSpError;
      
      // 새 출발장소 추가
      if (productData.startingPoints.length > 0) {
        const startingPointsToInsert = productData.startingPoints.map(sp => ({
          product_id: productId,
          starting_point_id: sp.starting_point_id,
          time: sp.time
        }));
        const { error: spError } = await supabase.from('ProductStartingPoints').insert(startingPointsToInsert);
        if (spError) throw spError;
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 상품 삭제 API
 * @param {number} productId - 삭제할 상품 ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteProduct(productId) {
  try {
    // 1. ProductImages 테이블에서 관련 이미지 삭제
    const { error: imgError } = await supabase
      .from('ProductImages')
      .delete()
      .eq('product_id', productId);
    
    if (imgError) throw imgError;
    
    // 2. ProductStartingPoints 테이블에서 관련 출발장소 삭제
    const { error: spError } = await supabase
      .from('ProductStartingPoints')
      .delete()
      .eq('product_id', productId);
    
    if (spError) throw spError;
    
    // 3. Products 테이블에서 상품 삭제
    const { error } = await supabase
      .from('Products')
      .delete()
      .eq('id', productId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 전체 상품 목록 조회 (관리자용)
 * @returns {Promise<{success: boolean, products: Array, error?: string}>}
 */
export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('Products')
      .select(`
        id,
        title,
        subtitle,
        main_image_url,
        product_code,
        product_number,
        duration,
        adult_price,
        child_price,
        event_content,
        included_items,
        excluded_items,
        likely_departure_threshold,
        confirmed_departure_threshold,
        status,
        created_at,
        category_id,
        tag_id,
        badge_id,
        location_id,
        category:category_id(id, name),
        tag:tag_id(id, name),
        badge:badge_id(id, name),
        location:location_id(id, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // ProductImages와 ProductStartingPoints에서 관련 데이터 가져오기
    const products = await Promise.all((data || []).map(async (product) => {
      // 이미지 가져오기
      const { data: imagesData } = await supabase
        .from('ProductImages')
        .select('image_url')
        .eq('product_id', product.id);
      
      // 출발장소 가져오기
      const { data: startingPointsData } = await supabase
        .from('ProductStartingPoints')
        .select(`
          starting_point_id,
          time,
          starting_point:starting_point_id(id, name)
        `)
        .eq('product_id', product.id);
      
      const images = [
        ...(product.main_image_url ? [{ name: 'main.jpg', url: product.main_image_url, size: 0 }] : []),
        ...((imagesData || []).map(img => ({ name: 'sub.jpg', url: img.image_url, size: 0 })))
      ];
      
      const startingPoints = (startingPointsData || []).map(sp => ({
        starting_point_id: sp.starting_point_id,
        name: sp.starting_point.name,
        time: sp.time
      }));
      
      return {
        ...product,
        images,
        startingPoints
      };
    }));
    
    return { success: true, products };
  } catch (error) {
    return { success: false, products: [], error: error.message };
  }
} 