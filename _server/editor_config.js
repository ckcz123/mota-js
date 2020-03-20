function editor_config() {
    this.address = "_server/config.json";
}

editor_config.prototype.load = function(callback) {
    var _this = this;
    fs.readFile(this.address, "utf-8", function(e, d) {
        if (e) {
            console.warn("无法读取配置文件, 已重新生成");
            _this.config = {};
            _this.save(callback);
        } else {
            _this.config = JSON.parse(d);
            if (callback) callback();
        }
    });
}

editor_config.prototype.get = function(key, defaultValue) {
    value = this.config[key];
    return value != null ? value : defaultValue;
}

editor_config.prototype.set = function(key, value, callback) {
    this.config[key] = value;
    if (callback !== false) this.save(callback);
}

editor_config.prototype.save = function(callback) {
    fs.writeFile(this.address, JSON.stringify(this.config) ,'utf-8', function(e) {
        if (e) alert("写入配置文件失败");
        if (callback instanceof Function) callback();
    })
}
