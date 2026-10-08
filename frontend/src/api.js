let sessionEnd = false


export function apiFetch(url, options = {}) {
    return fetch(url, options)
        .then(res => {
            if (res.status === 401) {
                if (!sessionEnd) {
                    sessionEnd = true

                    localStorage.removeItem('token')
                    localStorage.removeItem('user')

                    alert('Сессия истекла. Войдите снова')

                    window.location.href = '/'
                }

                throw new Error('Сессия истекла')
            }

            return res
        })
}