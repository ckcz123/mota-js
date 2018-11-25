"use strict";

function data() {
    this.init();
}

data.prototype.init = function() {
    this.firstData = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData;
    this.values = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.values;
    this.flags = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.flags;
    //delete(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d);
}

data.prototype.getFirstData = function() {
    return core.clone(this.firstData);
}