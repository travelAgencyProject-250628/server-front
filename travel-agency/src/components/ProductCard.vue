<template>
  <div 
    class="product-card"
    :class="{ 'dummy-product': product.isDummy }"
    @click="!product.isDummy && handleClick()"
  >
    <div class="product-image">
      <img :src="product.image" :alt="product.title" />
      <div class="product-badge red">{{ product.badge }}</div>
      <div v-if="product.tag" class="product-tag green">{{ product.tag }}</div>
    </div>
    <div class="product-info">
      <p class="product-category">{{ product.category }}</p>
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-price">
        <span class="product-number">상품번호 {{ product.isDummy ? product.id : product.id }}</span>
        <span class="price">{{ formatPrice(product.price) }}원~</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Props 정의
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: '',
      image: '',
      price: 0,
      badge: '',
      tag: '',
      category: '',
      isDummy: false
    })
  }
})

// 이벤트 정의
const emit = defineEmits(['click'])

// 클릭 핸들러
const handleClick = () => {
  if (!props.product.isDummy) {
    emit('click', props.product)
    router.push(`/product/${props.product.id}`)
  }
}

// 가격 포맷팅
const formatPrice = (price) => {
  if (!price || price === null || price === undefined) {
    return '0'
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-card.dummy-product {
  opacity: 0.7;
  cursor: default;
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card.dummy-product:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.product-badge.red {
  background-color: #ef4444;
}

.product-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.product-tag.green {
  background-color: #10b981;
}

.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.product-category {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.product-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-number {
  font-size: 0.75rem;
  color: #9ca3af;
}

.price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ef4444;
}

/* 모바일 스타일 */
@media (max-width: 768px) {
  .product-image {
    height: 180px;
  }
  
  .product-title {
    font-size: 1rem;
  }
  
  .price {
    font-size: 1rem;
  }
}
</style> 