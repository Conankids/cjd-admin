const util = {
    title(title) {
        const dTitle = title || '抽奖帝后台管理'
        window.document.title = dTitle
    },
    getRouterObjByName(routers, name) {
        if (!name || !routers || !routers.length) {
            return null
        }
        // debugger;
        let routerObj = null
        for (let item of routers) {
            if (item.name === name) {
                return item
            }
            routerObj = util.getRouterObjByName(item.children, name)
            if (routerObj) {
                return routerObj
            }
        }
        return null
    },
    toDefaultPage(routers, name, route, next) {
        let len = routers.length
        let i = 0
        let notHandle = true
        while (i < len) {
            if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
                const replaceName = routers[i].children.filter(item => !item.hidden)[0].name
                route.replace({
                    name: replaceName
                })
                notHandle = false
                next()
                break
            }
            i++
        }
        if (notHandle) {
            next()
        }
    },
    includeInArray(arr1, arr2) {
        let icd = false
        for (let i of arr1) {
            if (arr2.includes(i)) {
                icd = !icd
                break
            }
        }
        return icd
    },
    countDown(self, allTime, changeBack, callBack) {
        let displayTime

        function showTime() {
            let day = Math.floor(allTime / (60 * 60 * 24))
            let hour = Math.floor(allTime / (3600)) - (day * 24)
            let minute = Math.floor(allTime / (60)) - (day * 24 * 60) - (hour * 60)
            let second = Math.floor(allTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
            if (hour <= 9) hour = '0' + hour
            if (minute <= 9) minute = '0' + minute
            if (second <= 9) second = '0' + second
            allTime -= 1
            const timeData = {
                d: day,
                h: hour,
                m: minute,
                s: second
            }
            changeBack && changeBack.call(self, timeData)
        }

        showTime()
        displayTime = setInterval(function () {
            showTime()
            if (allTime == -1) {
                clearInterval(displayTime)
                callBack && callBack.call(self)
                return
            }
        }, 1000)
        return displayTime
    }
}

export default util