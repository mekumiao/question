import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/api/users'

export const useCurrentUser = defineStore(
  'currentUser',
  () => {
    const user = ref<User>()
    function setUser(input?: User) {
      user.value = input
    }
    return { user, setUser }
  },
  { persist: true },
)
