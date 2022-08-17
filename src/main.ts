// 需动态导入，不然发到网站上玩家还要加载。。。

window.onload = () => {
    if (!core.domStyle.isVertical && !location.href.includes('h5mota.com')) {
        import('./App.vue').then(App => {
            import('vue').then(v => v.createApp(App.default).mount('#ui-editor'))
        })
        import('./loadMonaco')
    }
}

document.oncontextmenu = e => false;

export { }