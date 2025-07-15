<template>
    <div class="navigation-page">
        <div class="page-header">
            <h2>네비게이션 관리</h2>
        </div>

        <div class="content-layout">
            <!-- 좌측: 메뉴 트리 -->
            <div class="menu-tree-panel">
                <div class="panel-header">
                    <h3>메뉴 구조</h3>
                    <button class="btn-primary btn-small" @click="createMainMenu">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        1차 메뉴 추가
                    </button>
                </div>
                <div class="tree-container">
                    <div v-if="loading" class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>메뉴를 불러오는 중...</p>
                    </div>
                    <div v-else-if="navigation.length === 0" class="empty-state">
                        <p>등록된 메뉴가 없습니다.</p>
                    </div>
                    <div v-else class="menu-tree">
                        <draggable v-model="navigation" group="menu" @change="handleDragChange" :animation="200"
                            item-key="id" class="draggable-list">
                            <template #item="{ element }">
                                <div class="menu-item main-menu" :class="{ 'menu-disabled': !element.isVisible }">
                                    <div class="menu-content" :class="{ active: selectedMenu?.id === element.id }"
                                        @click="selectMenu(element)">
                                        <div class="menu-info">
                                            <!-- <div class="menu-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </div> -->
                                            <div class="menu-text">
                                                <div class="menu-name">
                                                    {{ element.name }}
                                                    <span v-if="!element.isVisible"
                                                        class="status-badge disabled">비활성</span>
                                                </div>
                                                <div class="menu-id">ID: {{ element.id }}</div>
                                            </div>
                                        </div>
                                        <div class="menu-actions">
                                            <button class="btn-add-sub" @click.stop="createSubMenu(element.id)"
                                                title="하위 메뉴 추가">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"
                                                        stroke-linecap="round" />
                                                </svg>
                                            </button>
                                            <button class="btn-delete" @click.stop="deleteMenu(element.id)"
                                                title="메뉴 삭제">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                                                        stroke="currentColor" stroke-width="2" />
                                                    <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor"
                                                        stroke-width="2" />
                                                    <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor"
                                                        stroke-width="2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- 하위 메뉴 -->
                                    <div v-if="element.children && element.children.length > 0" class="sub-menu-list">
                                        <draggable v-model="element.children" group="sub-menu"
                                            @change="(evt) => handleSubMenuDragChange(evt, element.id)" :animation="200"
                                            item-key="id" class="draggable-sub-list">
                                            <template #item="{ element: child }">
                                                <div class="menu-item sub-menu"
                                                    :class="{ 'menu-disabled': !child.isVisible }">
                                                    <div class="sub-menu-connector"></div>
                                                    <div class="menu-content"
                                                        :class="{ active: selectedMenu?.id === child.id }"
                                                        @click="selectMenu(child)">
                                                        <div class="menu-info">
                                                            <div class="menu-icon sub-menu-icon">
                                                                <svg width="12" height="12" viewBox="0 0 24 24"
                                                                    fill="none">
                                                                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                                                                </svg>
                                                            </div>
                                                            <div class="menu-text">
                                                                <div class="menu-name">
                                                                    {{ child.name }}
                                                                    <span v-if="!child.isVisible"
                                                                        class="status-badge disabled">비활성</span>
                                                                </div>
                                                                <div class="menu-id">ID: {{ child.id }}</div>
                                                            </div>
                                                        </div>
                                                        <div class="menu-actions">
                                                            <button class="btn-delete"
                                                                @click.stop="deleteMenu(child.id)" title="메뉴 삭제">
                                                                <svg width="12" height="12" viewBox="0 0 24 24"
                                                                    fill="none">
                                                                    <path
                                                                        d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                                                                        stroke="currentColor" stroke-width="2" />
                                                                    <line x1="10" y1="11" x2="10" y2="17"
                                                                        stroke="currentColor" stroke-width="2" />
                                                                    <line x1="14" y1="11" x2="14" y2="17"
                                                                        stroke="currentColor" stroke-width="2" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </draggable>
                                    </div>
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </div>

            <!-- 우측: 메뉴 편집 폼 -->
            <div class="menu-edit-panel">
                <div class="panel-header">
                    <h3>메뉴 편집</h3>
                </div>

                <div v-if="!selectedMenu" class="no-selection">
                    <p>편집할 메뉴를 선택하세요</p>
                </div>

                <form v-else @submit.prevent="updateMenu" class="edit-form">
                    <div class="form-group">
                        <label for="menuType">메뉴 타입</label>
                        <div class="menu-type-text">
                            {{ selectedMenu.parentId === null ? '1차 메뉴' : '2차 메뉴' }}
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="menuId">ID</label>
                        <div class="menu-id-text">{{ selectedMenu.id }}</div>
                    </div>

                    <div class="form-group">
                        <label for="menuName">메뉴명 *</label>
                        <input type="text" id="menuName" v-model="editForm.name" required class="form-input">
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" v-model="editForm.isVisible" class="form-checkbox">
                            <span>메뉴 표시</span>
                        </label>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary" :disabled="updating">
                            {{ updating ? '저장 중...' : '저장' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 메뉴 생성 모달 -->
        <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ createMode === 'main' ? '1차 메뉴 추가' : '2차 메뉴 추가' }}</h3>
                    <button class="modal-close" @click="closeCreateModal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" />
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="handleCreateSubmit" class="modal-form">
                    <div class="form-group">
                        <label for="createMenuName">메뉴명 *</label>
                        <input type="text" id="createMenuName" v-model="createForm.name" required class="form-input"
                            placeholder="메뉴명을 입력하세요">
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" v-model="createForm.isVisible" class="form-checkbox">
                            <span>메뉴 표시</span>
                        </label>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" @click="closeCreateModal">
                            취소
                        </button>
                        <button type="submit" class="btn-primary" :disabled="creating">
                            {{ creating ? '생성 중...' : '생성' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { navigationService } from '@/lib/navigation.js'
import draggable from 'vuedraggable'

// 반응형 데이터
const navigation = ref([])
const loading = ref(false)
const selectedMenu = ref(null)
const showCreateModal = ref(false)
const createMode = ref('main') // 'main' or 'sub'
const createParentId = ref(null)
const updating = ref(false)
const creating = ref(false)

// 편집 폼 데이터
const editForm = ref({
    name: '',
    isVisible: true
})

// 생성 폼 데이터
const createForm = ref({
    name: '',
    isVisible: true
})

// 메서드
const loadNavigation = async () => {
    loading.value = true
    try {
        const result = await navigationService.getAllNavigation()
        if (result.success) {
            navigation.value = result.navigation
        } else {
            alert('메뉴 로드에 실패했습니다: ' + result.error)
        }
    } catch (error) {
        alert('메뉴 로드 중 오류가 발생했습니다')
        console.error(error)
    } finally {
        loading.value = false
    }
}

const selectMenu = (menu) => {
    selectedMenu.value = menu
    editForm.value = {
        name: menu.name,
        isVisible: menu.isVisible
    }
}

const updateMenu = async () => {
    if (!selectedMenu.value) return

    updating.value = true
    try {
        const result = await navigationService.updateMenu(selectedMenu.value.id, editForm.value)
        if (result.success) {
            alert(result.message)
            await loadNavigation()
            // 선택된 메뉴 정보 업데이트
            const updatedMenu = findMenuById(selectedMenu.value.id)
            if (updatedMenu) {
                selectedMenu.value = updatedMenu
            }
        } else {
            alert('메뉴 수정에 실패했습니다: ' + result.error)
        }
    } catch (error) {
        alert('메뉴 수정 중 오류가 발생했습니다')
        console.error(error)
    } finally {
        updating.value = false
    }
}

const createMainMenu = () => {
    createMode.value = 'main'
    createParentId.value = null
    resetCreateForm()
    showCreateModal.value = true
}

const createSubMenu = (parentId) => {
    createMode.value = 'sub'
    createParentId.value = parentId
    resetCreateForm()
    showCreateModal.value = true
}

const resetCreateForm = () => {
    createForm.value = {
        name: '',
        isVisible: true
    }
}

const handleCreateSubmit = async () => {
    creating.value = true
    try {
        let result
        if (createMode.value === 'main') {
            result = await navigationService.createMainMenu(createForm.value)
        } else {
            result = await navigationService.createSubMenu(createParentId.value, createForm.value)
        }

        if (result.success) {
            alert(result.message)
            closeCreateModal()
            await loadNavigation()
        } else {
            alert('메뉴 생성에 실패했습니다: ' + result.error)
        }
    } catch (error) {
        alert('메뉴 생성 중 오류가 발생했습니다')
        console.error(error)
    } finally {
        creating.value = false
    }
}

const closeCreateModal = () => {
    showCreateModal.value = false
    resetCreateForm()
}

const deleteMenu = async (id) => {
    const menuToDelete = findMenuById(id)
    if (!menuToDelete) return

    const hasChildren = menuToDelete.children && menuToDelete.children.length > 0
    const confirmMessage = hasChildren
        ? `'${menuToDelete.name}' 메뉴와 모든 하위 메뉴를 삭제하시겠습니까?`
        : `'${menuToDelete.name}' 메뉴를 삭제하시겠습니까?`

    if (!confirm(confirmMessage)) return

    try {
        const result = await navigationService.deleteMenu(id)
        if (result.success) {
            alert(result.message)
            await loadNavigation()
            // 삭제된 메뉴가 선택되어 있었다면 선택 해제
            if (selectedMenu.value && selectedMenu.value.id === id) {
                selectedMenu.value = null
            }
        } else {
            alert('메뉴 삭제에 실패했습니다: ' + result.error)
        }
    } catch (error) {
        alert('메뉴 삭제 중 오류가 발생했습니다')
        console.error(error)
    }
}

const handleDragChange = async (evt) => {
    if (evt.moved || evt.added) {
        try {
            const result = await navigationService.reorderMainMenus(navigation.value)
            if (result.success) {
                console.log('1차 메뉴 순서가 변경되었습니다')
            } else {
                alert('메뉴 순서 변경에 실패했습니다')
                await loadNavigation() // 원래 상태로 복원
            }
        } catch (error) {
            alert('메뉴 순서 변경 중 오류가 발생했습니다')
            console.error(error)
            await loadNavigation() // 원래 상태로 복원
        }
    }
}

const handleSubMenuDragChange = async (evt, parentId) => {
    if (evt.moved || evt.added) {
        try {
            const parentMenu = navigation.value.find(menu => menu.id === parentId)
            if (parentMenu) {
                const result = await navigationService.reorderSubMenus(parentId, parentMenu.children)
                if (result.success) {
                    console.log('2차 메뉴 순서가 변경되었습니다')
                } else {
                    alert('2차 메뉴 순서 변경에 실패했습니다')
                    await loadNavigation() // 원래 상태로 복원
                }
            }
        } catch (error) {
            alert('2차 메뉴 순서 변경 중 오류가 발생했습니다')
            console.error(error)
            await loadNavigation() // 원래 상태로 복원
        }
    }
}

const findMenuById = (id) => {
    const findInTree = (items, targetId) => {
        for (const item of items) {
            if (item.id === targetId) {
                return item
            }
            if (item.children && item.children.length > 0) {
                const found = findInTree(item.children, targetId)
                if (found) return found
            }
        }
        return null
    }
    return findInTree(navigation.value, id)
}

// 라이프사이클
onMounted(() => {
    loadNavigation()
})
</script>

<style scoped>
.navigation-page {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
}

.content-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    min-height: 0;
}

/* 패널 공통 스타일 */
.menu-tree-panel,
.menu-edit-panel {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.panel-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
}

/* 트리 패널 */
.tree-container {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;

}

.draggable-list {
    min-height: 50px;
}

.draggable-sub-list {
    min-height: 30px;
}

.menu-tree {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.menu-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
}

.menu-item.main-menu {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: 2px solid #e2e8f0;
}

.menu-item.sub-menu {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    margin-left: 1rem;
    position: relative;
}

.menu-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.main-menu .menu-content {
    padding: 1rem 1.25rem;
    border-radius: 6px;
}

.main-menu .menu-content:hover {
    background: #f1f5f9;
}

.main-menu .menu-content.active {
    background: #dbeafe;
}

.sub-menu .menu-content {
    padding: 0.5rem 1rem;
    padding-left: 2rem;
    background: transparent;
}

.sub-menu .menu-content:hover {
    background: #f1f5f9;
}

.sub-menu .menu-content.active {
    background: #e0f2fe;

}

.menu-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
}

.menu-icon {
    color: #6b7280;
    flex-shrink: 0;
}

.main-menu .menu-icon {
    color: #3b82f6;
}

.sub-menu-icon {
    color: #0ea5e9 !important;
}

.menu-text {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.menu-name {
    font-weight: 500;
    color: #1f2937;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.main-menu .menu-name {
    font-weight: 600;
    font-size: 1rem;
    color: #1f2937;
}

.sub-menu .menu-name {
    font-weight: 400;
    font-size: 0.875rem;
    color: #374151;
}

.menu-id {
    color: #6b7280;
    font-size: 0.75rem;
    font-family: monospace;
}

.main-menu .menu-id {
    color: #3b82f6;
    font-weight: 500;
}

.sub-menu .menu-id {
    color: #0ea5e9;
}

.menu-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-add-sub,
.btn-delete {
    padding: 0.375rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-add-sub {
    background: #e0f2fe;
    color: #0369a1;
}

.btn-add-sub:hover {
    background: #bae6fd;
}

.btn-delete {
    background: #fee2e2;
    color: #dc2626;
}

.btn-delete:hover {
    background: #fecaca;
}

.sub-menu-list {
    border-top: 2px solid #e5e7eb;
    background: #f8fafc;
    padding: 0.5rem 0;
    position: relative;
}


.sub-menu-connector {
    position: absolute;
    left: -1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 2px;
    background: #cbd5e1;
}

.sub-menu-connector::before {
    content: '';
    position: absolute;
    left: 0;
    top: -0.5rem;
    width: 2px;
    height: 1rem;
    background: #cbd5e1;
}

/* 드래그 시 효과 */
.sortable-ghost {
    opacity: 0.4;
}

.sortable-chosen {
    opacity: 0.8;
    transform: scale(1.02);
}

.sortable-drag {
    opacity: 0.9;
    background: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transform: rotate(2deg);
}

/* 비활성화된 메뉴 스타일 */
.menu-disabled {
    opacity: 0.5;
}

.menu-disabled .menu-content {
    background: #f1f5f9;
}

.menu-disabled .menu-name {
    color: #9ca3af;
}

.menu-disabled .menu-id {
    color: #d1d5db;
}

.menu-disabled .menu-icon {
    color: #d1d5db;
}

/* 편집 패널 */
.no-selection {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #6b7280;
    text-align: center;
}

.no-selection svg {
    margin-bottom: 1rem;
    color: #d1d5db;
}

.edit-form {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.form-input,
.form-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.readonly {
    background-color: #f3f4f6;
    color: #6b7280;
    cursor: not-allowed;
}

.form-input.readonly:focus {
    border-color: #e5e7eb;
    box-shadow: none;
}

.menu-type-text {
    padding: 0.25rem 0;
    font-size: 1rem;
    font-weight: 400;
    color: #1f2937;
    background: #f9fafb;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
}

.menu-id-text {
    padding: 0.25rem 0;
    font-size: 1rem;
    font-weight: 400;
    color: #1f2937;
    font-family: monospace;
    background: #f9fafb;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
}

.status-badge {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.disabled {
    background: #f3f4f6;
    color: #6b7280;
    border: 1px solid #9ca3af;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    user-select: none;
    line-height: 1;
}

.form-checkbox {
    position: relative;
    width: 20px;
    height: 20px;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    background: white;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    vertical-align: middle;
}

.form-checkbox:hover {
    border-color: #3b82f6;
}

.form-checkbox:checked {
    background: #3b82f6;
    border-color: #3b82f6;
}

.form-checkbox:checked::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 5px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.form-checkbox:focus {
    outline: none;
}

.checkbox-label span {
    margin-left: 5px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.form-actions {
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

/* 버튼 스타일 */
.btn-primary,
.btn-secondary {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: #3b82f6;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #2563eb;
}

.btn-primary:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.btn-secondary {
    background: #6b7280;
    color: white;
}

.btn-secondary:hover {
    background: #4b5563;
}

.btn-small {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
}

/* 로딩 및 빈 상태 */
.loading-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
    text-align: center;
    color: #6b7280;
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 모달 스타일 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
}

.modal-close {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
}

.modal-close:hover {
    color: #374151;
}

.modal-form {
    padding: 1.5rem;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
    .content-layout {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }

    .menu-tree-panel {
        max-height: 300px;
    }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .modal-content {
        width: 95%;
        margin: 1rem;
    }

    .modal-actions {
        flex-direction: column;
    }
}
</style>