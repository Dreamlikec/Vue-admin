const login = {
    state: {},
    getters: {},
    mutations: {},
    actions: {
        login(content, repuestData) {
            return new Promise((resolve, reject) => {
                Login(repuestData).then((response) => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    },
}

export default login;