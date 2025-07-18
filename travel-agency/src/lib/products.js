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
    const { data, error } = await supabase
      .from('Products')
      .select('id, title, subtitle, main_image_url, adult_price, child_price, duration, location_id:location_id(id, name), badge_id:badge_id(id, name)')
      .order('created_at', { ascending: false })
      .limit(6)
    if (error) throw error

    // 더미 데이터 형식에 맞게 매핑
    const tours = (data || []).map((item, idx) => ({
      id: item.id,
      title: item.title || '',
      description: item.subtitle || '',
      duration: item.duration || '',
      location: item.location?.name || '',
      price: item.adult_price || 0,
      badge: item.badge_id?.name || '',
      image: item.main_image_url || ''
    }))

    return { success: true, tours }
  } catch (error) {
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
        category:category_id(id, name)
      `)
      .eq('id', productId)
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
    // 1차: Products의 텍스트 필드만 or 검색
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
 * 상품 추가(등록) + 이미지 업로드 지원
 * @param {object} productData - 등록할 상품 정보 (images: File[] 포함 가능)
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
    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
} 