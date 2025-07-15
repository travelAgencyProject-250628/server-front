// 네비게이션 메뉴 더미 데이터
let mockNavigation = [
  {
    id: 1,
    name: '홈',
    order: 1,
    parentId: null,
    isVisible: true,
    children: []
  },
  {
    id: 2,
    name: '상품',
    order: 2,
    parentId: null,
    isVisible: true,
    children: [
      {
        id: 3,
        name: '국내여행',
        order: 1,
        parentId: 2,
        isVisible: true
      },
      {
        id: 4,
        name: '해외여행',
        order: 2,
        parentId: 2,
        isVisible: true
      }
    ]
  },
  {
    id: 5,
    name: '예약',
    order: 3,
    parentId: null,
    isVisible: true,
    children: []
  },
  {
    id: 6,
    name: '고객센터',
    order: 4,
    parentId: null,
    isVisible: true,
    children: [
      {
        id: 7,
        name: '공지사항',
        order: 1,
        parentId: 6,
        isVisible: true
      },
      {
        id: 8,
        name: 'FAQ',
        order: 2,
        parentId: 6,
        isVisible: true
      }
    ]
  }
]

// ID 생성을 위한 카운터
let nextId = 9

class NavigationService {
  
  // 모든 네비게이션 메뉴 가져오기
  async getAllNavigation() {
    try {
      // 실제 구현에서는 API 호출
      // const response = await fetch('/api/navigation')
      // const data = await response.json()
      
      return {
        success: true,
        navigation: mockNavigation
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 특정 메뉴 가져오기
  async getNavigationById(id) {
    try {
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

      const menu = findInTree(mockNavigation, id)
      
      if (menu) {
        return {
          success: true,
          menu: menu
        }
      } else {
        return {
          success: false,
          error: '메뉴를 찾을 수 없습니다.'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 1차 메뉴 생성
  async createMainMenu(menuData) {
    try {
      const newMenu = {
        id: nextId++,
        name: menuData.name,
        order: mockNavigation.length + 1,
        parentId: null,
        isVisible: menuData.isVisible || true,
        children: []
      }

      mockNavigation.push(newMenu)

      return {
        success: true,
        message: '1차 메뉴가 성공적으로 생성되었습니다.',
        menu: newMenu
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 2차 메뉴 생성
  async createSubMenu(parentId, menuData) {
    try {
      const parentMenu = mockNavigation.find(menu => menu.id === parentId)
      if (!parentMenu) {
        return {
          success: false,
          error: '부모 메뉴를 찾을 수 없습니다.'
        }
      }

      const newSubMenu = {
        id: nextId++,
        name: menuData.name,
        order: parentMenu.children.length + 1,
        parentId: parentId,
        isVisible: menuData.isVisible || true
      }

      parentMenu.children.push(newSubMenu)

      return {
        success: true,
        message: '2차 메뉴가 성공적으로 생성되었습니다.',
        menu: newSubMenu
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 메뉴 수정
  async updateMenu(id, menuData) {
    try {
      const updateInTree = (items, targetId, data) => {
        for (const item of items) {
          if (item.id === targetId) {
            Object.assign(item, data)
            return true
          }
          if (item.children && item.children.length > 0) {
            if (updateInTree(item.children, targetId, data)) {
              return true
            }
          }
        }
        return false
      }

      const updated = updateInTree(mockNavigation, id, menuData)
      
      if (updated) {
        return {
          success: true,
          message: '메뉴가 성공적으로 수정되었습니다.'
        }
      } else {
        return {
          success: false,
          error: '메뉴를 찾을 수 없습니다.'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 메뉴 삭제
  async deleteMenu(id) {
    try {
      const deleteFromTree = (items, targetId) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === targetId) {
            items.splice(i, 1)
            return true
          }
          if (items[i].children && items[i].children.length > 0) {
            if (deleteFromTree(items[i].children, targetId)) {
              return true
            }
          }
        }
        return false
      }

      const deleted = deleteFromTree(mockNavigation, id)
      
      if (deleted) {
        return {
          success: true,
          message: '메뉴가 성공적으로 삭제되었습니다.'
        }
      } else {
        return {
          success: false,
          error: '메뉴를 찾을 수 없습니다.'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 메뉴 순서 변경 (1차 메뉴만)
  async reorderMainMenus(reorderedMenus) {
    try {
      // 1차 메뉴들의 순서를 업데이트
      reorderedMenus.forEach((menu, index) => {
        const existingMenu = mockNavigation.find(m => m.id === menu.id)
        if (existingMenu) {
          existingMenu.order = index + 1
        }
      })

      // 순서에 따라 재정렬
      mockNavigation.sort((a, b) => a.order - b.order)

      return {
        success: true,
        message: '메뉴 순서가 성공적으로 변경되었습니다.'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 2차 메뉴 순서 변경
  async reorderSubMenus(parentId, reorderedSubMenus) {
    try {
      const parentMenu = mockNavigation.find(menu => menu.id === parentId)
      if (!parentMenu) {
        return {
          success: false,
          error: '부모 메뉴를 찾을 수 없습니다.'
        }
      }

      // 2차 메뉴들의 순서를 업데이트
      reorderedSubMenus.forEach((subMenu, index) => {
        const existingSubMenu = parentMenu.children.find(child => child.id === subMenu.id)
        if (existingSubMenu) {
          existingSubMenu.order = index + 1
        }
      })

      // 순서에 따라 재정렬
      parentMenu.children.sort((a, b) => a.order - b.order)

      return {
        success: true,
        message: '2차 메뉴 순서가 성공적으로 변경되었습니다.'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export const navigationService = new NavigationService() 