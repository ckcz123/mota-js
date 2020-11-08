function editor_config() {
    this.address = "_server/config.json";
    this._isWriting = false;
}

editor_config.prototype.load = function(callback) {
    var _this = this;
    fs.readFile(this.address, "utf-8", function(e, d) {
        if (e) {
            console.error("无法读取配置文件, 已重新生成");
            _this.config = {};
            _this.save(callback);
        } else {
            try {
                _this.config = JSON.parse(d);
                if (callback) callback();
            } catch (e) {
                console.error(e);
                _this.config = {};
                _this.save(callback);
            }
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
    // 读写锁防止写文件冲突
    if (this._isWriting) return;
    try {
        this._isWriting = true;
        var _this = this;
        fs.writeFile(this.address, JSON.stringify(this.config) ,'utf-8', function(e) {
            _this._isWriting = false;
            if (e) console.error("写入配置文件失败");
            if (callback instanceof Function) callback();
        })
    } catch (e) {
        this._isWriting = false;
        console.error(e);
        if (callback instanceof Function) callback();
    }
}
