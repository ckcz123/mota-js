function maps() {

}

maps.prototype.init = function () {

    var map_txt = [
        [ // 0F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 87, 0, 0, 0, 0, 0, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 1F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 87, 0, 101, 102, 101, 0, 0, 0, 0, 0, 0, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6],
            [6, 18, 0, 105, 81, 0, 1, 12, 19, 15, 1, 0, 6],
            [6, 15, 113, 12, 1, 0, 1, 1, 82, 1, 1, 0, 6],
            [6, 1, 81, 1, 1, 0, 1, 0, 105, 0, 1, 101, 6],
            [6, 0, 113, 0, 1, 0, 1, 15, 102, 15, 1, 0, 6],
            [6, 15, 113, 11, 1, 0, 1, 1, 81, 1, 1, 0, 6],
            [6, 1, 81, 1, 1, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 12, 114, 11, 1, 1, 81, 1, 1, 1, 83, 1, 6],
            [6, 0, 18, 0, 1, 15, 15, 16, 1, 16, 113, 16, 6],
            [6, 15, 35, 16, 1, 32, 0, 33, 1, 15, 15, 15, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 2F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 88, 1, 117, 19, 19, 19, 0, 19, 19, 19, 117, 6],
            [6, 0, 1, 0, 1, 1, 1, 81, 1, 1, 1, 0, 6],
            [6, 0, 1, 12, 1, 1, 0, 0, 0, 1, 1, 11, 6],
            [6, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 6],
            [6, 0, 1, 118, 1, 1, 0, 143, 0, 1, 1, 118, 6],
            [6, 0, 1, 141, 37, 1, 1, 83, 1, 1, 38, 141, 6],
            [6, 0, 1, 12, 1, 1, 1, 11, 1, 1, 1, 11, 6],
            [6, 0, 1, 1, 1, 1, 12, 12, 12, 1, 1, 1, 6],
            [6, 0, 1, 0, 1, 19, 110, 16, 110, 15, 0, 117, 6],
            [6, 0, 81, 110, 1, 1, 1, 1, 1, 1, 1, 81, 6],
            [6, 87, 1, 0, 0, 0, 18, 18, 18, 0, 0, 0, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 3F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 15, 113, 16, 1, 113, 71, 113, 1, 11, 18, 101, 6],
            [6, 105, 1, 105, 1, 12, 113, 11, 1, 18, 101, 0, 6],
            [6, 0, 1, 0, 1, 1, 82, 1, 1, 101, 113, 19, 6],
            [6, 0, 81, 0, 15, 15, 0, 0, 1, 1, 81, 1, 6],
            [6, 101, 1, 81, 1, 1, 1, 0, 1, 0, 0, 0, 6],
            [6, 102, 1, 0, 1, 0, 81, 0, 1, 0, 1, 0, 6],
            [6, 101, 1, 0, 102, 0, 1, 101, 1, 17, 1, 0, 6],
            [6, 0, 1, 1, 1, 81, 1, 113, 1, 15, 1, 113, 6],
            [6, 0, 0, 0, 1, 105, 1, 101, 1, 15, 1, 0, 6],
            [6, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 6],
            [6, 88, 0, 0, 1, 0, 102, 0, 105, 0, 1, 87, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 4F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 0, 0, 0, 0, 114, 105, 105, 0, 0, 0, 87, 6],
            [6, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 0, 0, 0, 0, 18, 0, 109, 0, 0, 81, 0, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6],
            [6, 1, 117, 15, 1, 11, 18, 1, 12, 15, 1, 114, 6],
            [6, 1, 47, 117, 81, 0, 110, 82, 19, 109, 81, 0, 6],
            [6, 1, 117, 15, 1, 11, 19, 1, 12, 15, 1, 113, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6],
            [6, 0, 0, 0, 0, 18, 0, 109, 0, 0, 81, 0, 6],
            [6, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 0, 0, 0, 0, 113, 105, 105, 0, 0, 0, 88, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 5F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 22, 1, 118, 81, 0, 72, 0, 82, 0, 81, 88, 6],
            [6, 0, 1, 0, 1, 0, 0, 0, 1, 113, 1, 0, 6],
            [6, 110, 1, 110, 1, 1, 110, 1, 1, 19, 1, 0, 6],
            [6, 0, 0, 0, 1, 16, 114, 15, 1, 12, 1, 0, 6],
            [6, 1, 83, 1, 1, 1, 81, 1, 1, 1, 1, 0, 6],
            [6, 0, 0, 0, 114, 0, 0, 81, 0, 0, 0, 0, 6],
            [6, 1, 81, 1, 1, 1, 114, 1, 110, 1, 1, 1, 6],
            [6, 19, 117, 19, 1, 0, 0, 1, 0, 11, 11, 0, 6],
            [6, 15, 15, 15, 1, 0, 1, 1, 1, 1, 1, 0, 6],
            [6, 1, 1, 1, 1, 81, 1, 15, 1, 15, 1, 0, 6],
            [6, 87, 117, 0, 7, 0, 114, 18, 110, 18, 114, 0, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 6F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 19, 19, 19, 1, 118, 34, 118, 1, 12, 12, 12, 6],
            [6, 18, 18, 18, 1, 0, 117, 0, 1, 11, 11, 11, 6],
            [6, 1, 81, 1, 1, 1, 82, 1, 1, 1, 81, 1, 6],
            [6, 114, 0, 0, 110, 81, 117, 81, 110, 0, 0, 114, 6],
            [6, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 6],
            [6, 18, 1, 110, 1, 17, 16, 15, 1, 110, 1, 19, 6],
            [6, 114, 81, 0, 1, 1, 82, 1, 1, 0, 81, 114, 6],
            [6, 11, 1, 109, 1, 19, 114, 19, 1, 109, 1, 12, 6],
            [6, 11, 1, 110, 1, 1, 81, 1, 1, 110, 1, 12, 6],
            [6, 1, 1, 109, 1, 18, 0, 73, 1, 109, 1, 1, 6],
            [6, 88, 81, 0, 0, 0, 114, 0, 0, 0, 81, 87, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 7F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 23, 7, 7, 7, 0, 16, 0, 83, 18, 118, 18, 6],
            [6, 1, 1, 1, 1, 117, 1, 117, 1, 117, 18, 117, 6],
            [6, 0, 1, 0, 1, 117, 1, 19, 1, 1, 81, 1, 6],
            [6, 118, 0, 117, 0, 12, 1, 11, 1, 15, 19, 19, 6],
            [6, 1, 1, 1, 81, 1, 1, 1, 1, 15, 1, 81, 6],
            [6, 11, 0, 0, 118, 0, 1, 0, 81, 0, 1, 117, 6],
            [6, 11, 1, 117, 19, 117, 19, 117, 1, 117, 1, 117, 6],
            [6, 11, 1, 1, 1, 1, 1, 1, 1, 117, 1, 46, 6],
            [6, 0, 0, 117, 12, 117, 0, 0, 1, 81, 1, 1, 6],
            [6, 1, 81, 1, 1, 1, 1, 7, 1, 117, 0, 0, 6],
            [6, 87, 118, 117, 11, 117, 0, 0, 1, 0, 0, 88, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 8F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 120, 0, 120, 0, 0, 0, 0, 0, 81, 0, 87, 6],
            [6, 0, 81, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6],
            [6, 120, 6, 6, 12, 12, 6, 11, 11, 6, 6, 82, 6],
            [6, 0, 6, 12, 12, 12, 6, 11, 11, 11, 6, 0, 6],
            [6, 0, 6, 12, 12, 12, 6, 11, 11, 11, 6, 0, 6],
            [6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6],
            [6, 0, 6, 19, 19, 19, 6, 15, 15, 15, 6, 0, 6],
            [6, 0, 6, 19, 19, 19, 6, 16, 16, 16, 6, 0, 6],
            [6, 81, 6, 6, 19, 19, 6, 17, 17, 6, 6, 118, 6],
            [6, 0, 51, 6, 6, 6, 6, 6, 6, 6, 81, 0, 6],
            [6, 88, 0, 81, 0, 0, 0, 0, 0, 118, 0, 120, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 9F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 25, 7, 0, 1, 0, 1, 0, 0, 0, 0, 88, 6],
            [6, 7, 120, 124, 83, 15, 1, 124, 1, 1, 1, 1, 6],
            [6, 1, 81, 1, 1, 15, 1, 12, 1, 19, 12, 11, 6],
            [6, 19, 19, 19, 1, 124, 1, 118, 1, 0, 118, 0, 6],
            [6, 124, 0, 124, 1, 15, 1, 12, 1, 118, 124, 118, 6],
            [6, 1, 82, 1, 1, 15, 1, 118, 1, 1, 81, 1, 6],
            [6, 118, 0, 118, 120, 0, 1, 0, 118, 18, 18, 18, 6],
            [6, 1, 81, 1, 1, 0, 81, 0, 1, 1, 81, 1, 6],
            [6, 18, 0, 0, 1, 1, 81, 1, 1, 0, 120, 0, 6],
            [6, 1, 1, 118, 1, 118, 0, 118, 1, 81, 1, 81, 6],
            [6, 87, 120, 0, 82, 0, 1, 46, 1, 12, 1, 11, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 10F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 12, 1, 11, 1, 19, 1, 16, 1, 17, 1, 15, 6],
            [6, 12, 1, 11, 1, 19, 1, 16, 1, 17, 1, 15, 6],
            [6, 81, 1, 81, 1, 81, 1, 81, 1, 81, 1, 81, 6],
            [6, 119, 0, 119, 0, 119, 1, 124, 0, 124, 0, 124, 6],
            [6, 81, 1, 82, 1, 1, 1, 1, 1, 82, 1, 81, 6],
            [6, 18, 1, 0, 120, 145, 119, 145, 120, 0, 1, 18, 6],
            [6, 18, 1, 0, 1, 1, 1, 1, 1, 0, 1, 18, 6],
            [6, 1, 1, 145, 1, 120, 74, 120, 1, 145, 1, 1, 6],
            [6, 19, 120, 0, 1, 0, 145, 0, 1, 0, 120, 19, 6],
            [6, 1, 83, 1, 1, 15, 15, 15, 1, 1, 83, 1, 6],
            [6, 88, 0, 0, 120, 0, 145, 0, 120, 0, 0, 87, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 11F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 1, 24, 1, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 87, 0, 145, 46, 145, 119, 145, 46, 145, 0, 88, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 12F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 19, 1, 1, 1, 1, 0, 0, 0, 0, 0, 87, 6],
            [6, 0, 1, 0, 0, 127, 0, 1, 1, 1, 1, 0, 6],
            [6, 0, 1, 0, 1, 1, 0, 1, 12, 12, 1, 0, 6],
            [6, 0, 1, 0, 43, 1, 0, 1, 12, 12, 1, 0, 6],
            [6, 119, 1, 1, 1, 1, 119, 1, 1, 1, 1, 119, 6],
            [6, 0, 0, 0, 0, 145, 0, 145, 0, 0, 0, 0, 6],
            [6, 126, 1, 1, 1, 1, 126, 1, 1, 1, 1, 126, 6],
            [6, 0, 1, 11, 11, 1, 0, 1, 47, 0, 141, 0, 6],
            [6, 0, 1, 11, 11, 1, 0, 1, 1, 1, 1, 0, 6],
            [6, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 6],
            [6, 88, 0, 0, 0, 0, 0, 1, 0, 0, 0, 19, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 13F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 87, 0, 126, 0, 0, 82, 0, 0, 126, 0, 88, 6],
            [6, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 6],
            [6, 126, 1, 1, 15, 1, 0, 1, 19, 1, 1, 126, 6],
            [6, 0, 1, 36, 15, 1, 0, 1, 19, 19, 1, 0, 6],
            [6, 127, 1, 15, 126, 1, 0, 1, 126, 19, 1, 127, 6],
            [6, 0, 1, 126, 127, 82, 128, 82, 127, 126, 1, 0, 6],
            [6, 127, 1, 12, 126, 1, 0, 1, 126, 11, 1, 127, 6],
            [6, 0, 1, 12, 12, 1, 0, 1, 11, 11, 1, 0, 6],
            [6, 127, 1, 1, 12, 1, 0, 1, 11, 1, 1, 127, 6],
            [6, 0, 0, 1, 1, 1, 83, 1, 1, 1, 0, 0, 6],
            [6, 0, 0, 128, 0, 128, 0, 128, 0, 128, 0, 0, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 14F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 1, 1, 18, 1, 1, 0, 0, 0, 6],
            [6, 0, 0, 0, 1, 18, 31, 18, 1, 0, 0, 0, 6],
            [6, 0, 0, 0, 1, 1, 18, 1, 1, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 1, 85, 1, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 141, 0, 141, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 15F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 53, 6, 18, 1, 19, 1, 12, 12, 12, 1, 87, 6],
            [6, 0, 1, 131, 1, 126, 1, 12, 128, 12, 1, 0, 6],
            [6, 141, 82, 0, 1, 81, 1, 1, 81, 1, 1, 0, 6],
            [6, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6],
            [6, 19, 18, 1, 127, 1, 126, 1, 1, 0, 1, 0, 6],
            [6, 19, 18, 18, 1, 75, 0, 1, 52, 127, 83, 0, 6],
            [6, 19, 18, 1, 127, 1, 126, 1, 1, 0, 1, 0, 6],
            [6, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6],
            [6, 0, 82, 0, 1, 81, 1, 1, 81, 1, 1, 0, 6],
            [6, 43, 1, 131, 1, 126, 1, 11, 128, 11, 1, 0, 6],
            [6, 44, 6, 18, 1, 19, 1, 11, 11, 11, 1, 88, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 16F
            [4, 4, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [4, 4, 4, 4, 6, 0, 0, 0, 0, 0, 0, 88, 6],
            [4, 4, 4, 4, 6, 6, 0, 6, 6, 6, 6, 6, 6],
            [4, 4, 4, 4, 4, 6, 0, 6, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 6, 0, 6, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 6, 0, 6, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 6, 108, 6, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 6, 0, 6, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 6, 87, 6, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        ],
        [ // 17F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 1, 131, 128, 0, 0, 0, 0, 0, 0, 0, 131, 6],
            [6, 1, 128, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6],
            [6, 1, 0, 1, 131, 0, 0, 0, 0, 0, 0, 131, 6],
            [6, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 6],
            [6, 1, 0, 1, 0, 1, 131, 0, 0, 0, 131, 89, 6],
            [6, 1, 0, 1, 131, 0, 0, 1, 1, 1, 0, 1, 6],
            [6, 1, 0, 1, 1, 1, 1, 1, 131, 0, 131, 1, 6],
            [6, 1, 128, 1, 1, 1, 88, 1, 0, 1, 1, 1, 6],
            [6, 1, 131, 128, 0, 0, 0, 1, 131, 0, 0, 131, 6],
            [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6],
            [6, 87, 84, 131, 0, 0, 0, 0, 0, 0, 0, 131, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 18F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 1, 1, 1, 126, 0, 87, 0, 131, 1, 1, 1, 6],
            [6, 1, 1, 1, 1, 19, 1, 19, 1, 1, 1, 1, 6],
            [6, 1, 1, 1, 126, 0, 19, 0, 131, 1, 1, 1, 6],
            [6, 126, 1, 126, 1, 128, 1, 128, 1, 131, 1, 131, 6],
            [6, 0, 15, 0, 128, 0, 0, 0, 128, 0, 15, 0, 6],
            [6, 15, 1, 15, 1, 0, 54, 0, 1, 15, 1, 15, 6],
            [6, 0, 15, 0, 128, 0, 0, 0, 128, 0, 15, 0, 6],
            [6, 131, 1, 131, 1, 128, 1, 128, 1, 127, 1, 127, 6],
            [6, 0, 0, 0, 131, 0, 17, 0, 127, 1, 1, 1, 6],
            [6, 0, 1, 0, 1, 17, 1, 17, 1, 1, 1, 1, 6],
            [6, 88, 0, 0, 131, 0, 17, 0, 127, 1, 1, 1, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 19F
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 128, 0, 12, 12, 0, 88, 0, 18, 18, 0, 141, 6],
            [6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6],
            [6, 19, 6, 4, 4, 4, 4, 4, 4, 4, 6, 11, 6],
            [6, 19, 6, 4, 4, 4, 4, 4, 4, 4, 6, 11, 6],
            [6, 0, 6, 4, 4, 4, 4, 4, 4, 4, 6, 0, 6],
            [6, 131, 6, 4, 4, 4, 4, 4, 4, 4, 6, 131, 6],
            [6, 0, 6, 4, 4, 4, 4, 4, 4, 4, 6, 0, 6],
            [6, 11, 6, 4, 4, 4, 4, 4, 4, 4, 6, 19, 6],
            [6, 11, 6, 4, 4, 4, 4, 4, 4, 4, 6, 19, 6],
            [6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6],
            [6, 141, 0, 18, 18, 0, 89, 0, 12, 12, 0, 128, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        [ // 20F
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4],
            [4, 4, 6, 0, 0, 0, 0, 0, 0, 0, 6, 4, 4],
            [4, 4, 6, 0, 0, 0, 0, 0, 0, 0, 6, 4, 4],
            [4, 4, 6, 0, 0, 131, 131, 131, 0, 0, 6, 4, 4],
            [4, 4, 6, 0, 0, 131, 144, 131, 0, 0, 6, 4, 4],
            [4, 4, 6, 0, 0, 131, 131, 131, 0, 0, 6, 4, 4],
            [4, 4, 6, 0, 0, 0, 0, 0, 0, 0, 6, 4, 4],
            [4, 4, 6, 0, 0, 0, 0, 0, 0, 0, 6, 4, 4],
            [4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        ],

        // 隐藏1层
        [
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4],
            [4, 4, 2, 11, 2, 43, 0, 30, 2, 12, 2, 4, 4],
            [4, 4, 2, 11, 2, 2, 81, 2, 2, 12, 2, 4, 4],
            [4, 4, 2, 11, 81, 0, 0, 0, 81, 12, 2, 4, 4],
            [4, 4, 2, 11, 2, 0, 0, 0, 2, 12, 2, 4, 4],
            [4, 4, 2, 11, 2, 0, 142, 0, 2, 12, 2, 4, 4],
            [4, 4, 2, 2, 2, 2, 83, 2, 2, 2, 2, 4, 4],
            [4, 4, 2, 0, 0, 0, 0, 0, 0, 89, 2, 4, 4],
            [4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        ]
    ]

    this.maps = [];
    for (var f = 0; f < map_txt.length; f++) {
        var floorId = 'MT' + f;
        var map = map_txt[f];
        var content = {};
        content['floorId'] = floorId;
        content['name'] = f;
        content['title'] = '主塔 ' + f + ' 层';
        if (f==21) { // 隐藏层
            content['name'] = '17';
            content['title'] = '隐藏层';
        }
        content['canFlyTo'] = true;
        if (f==0 || f==14 || f==20 || f==21) content['canFlyTo'] = false;
        var blocks = [];
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 13; j++) {
                var id = map[i][j];
                var block = this.getBlock(floorId, f, j, i, id);
                if (block!=null) blocks.push(block);
            }
        }
        content['blocks'] = blocks;
        this.maps[floorId] = content;
    }
}

maps.prototype.getBlock = function (floorId, f, x, y, id) {
    var tmp = {'x': x, 'y': y, 'id': id};

    // 16F的事件处理
    if (id == 0) {
        if (floorId=="MT16" && x==6 && y==2) {
            tmp.event = {'cls': 'terrains', 'id': 'ground', 'noPass': false, 'trigger': 'blockEvent'};
        }
    }
    // 0-9 地形
    if (id == 1) tmp.event = {'cls': 'terrains', 'id': 'yellowWall'}; // 黄墙
    if (id == 2) tmp.event = {'cls': 'terrains', 'id': 'blueWall'}; // 蓝墙
    if (id == 3) tmp.event = {'cls': 'animates', 'id': 'lava', 'animate': 4, 'noPass': true}; // 岩浆
    if (id == 4) tmp.event = {'cls': 'animates', 'id': 'star', 'animate': 4, 'noPass': true}; // 星空
    // if (id==5) tmp.fg = {'cls': 'animates', 'id': 'star', 'animate': 4, 'noPass': true}; // 栅栏
    if (id == 6) tmp.event = {'cls': 'terrains', 'id': 'whiteWall'}; // 白墙
    if (id == 7) tmp.event = {'cls': 'animates', 'id': 'lavaNet', 'animate': 4, 'noPass': false, 'trigger': 'passNet'};

    // 11-50 物品
    if (id == 11) tmp.event = {'cls': 'items', 'id': 'redJewel', 'trigger': 'getItem'}; // 红宝石
    if (id == 12) tmp.event = {'cls': 'items', 'id': 'blueJewel', 'trigger': 'getItem'}; // 蓝宝石
    if (id == 13) tmp.event = {'cls': 'items', 'id': 'greenJewel', 'trigger': 'getItem'}; // 绿宝石
    if (id == 14) tmp.event = {'cls': 'items', 'id': 'yellowJewel', 'trigger': 'getItem'}; // 黄宝石
    if (id == 15) tmp.event = {'cls': 'items', 'id': 'yellowKey', 'trigger': 'getItem'}; // 黄钥匙
    if (id == 16) tmp.event = {'cls': 'items', 'id': 'blueKey', 'trigger': 'getItem'}; // 蓝钥匙
    if (id == 17) tmp.event = {'cls': 'items', 'id': 'redKey', 'trigger': 'getItem'}; // 红钥匙
    if (id == 18) tmp.event = {'cls': 'items', 'id': 'redPotion', 'trigger': 'getItem'}; // 红血瓶
    if (id == 19) tmp.event = {'cls': 'items', 'id': 'bluePotion', 'trigger': 'getItem'}; // 蓝血瓶
    if (id == 20) tmp.event = {'cls': 'items', 'id': 'yellowPotion', 'trigger': 'getItem'}; // 黄血瓶
    if (id == 21) tmp.event = {'cls': 'items', 'id': 'greenPotion', 'trigger': 'getItem'}; // 绿血瓶
    if (id == 22) tmp.event = {'cls': 'items', 'id': 'sword1', 'trigger': 'getItem'}; // 铁剑
    if (id == 23) tmp.event = {'cls': 'items', 'id': 'shield1', 'trigger': 'getItem'}; // 铁盾
    if (id == 24) tmp.event = {'cls': 'items', 'id': 'sword2', 'trigger': 'getItem'}; // 银剑
    if (id == 25) tmp.event = {'cls': 'items', 'id': 'shield2', 'trigger': 'getItem'}; // 银盾
    if (id == 26) tmp.event = {'cls': 'items', 'id': 'sword3', 'trigger': 'getItem'}; // 骑士剑
    if (id == 27) tmp.event = {'cls': 'items', 'id': 'shield3', 'trigger': 'getItem'}; // 骑士盾
    if (id == 28) tmp.event = {'cls': 'items', 'id': 'sword4', 'trigger': 'getItem'}; // 圣剑
    if (id == 29) tmp.event = {'cls': 'items', 'id': 'shield4', 'trigger': 'getItem'}; // 圣盾
    if (id == 30) tmp.event = {'cls': 'items', 'id': 'sword5', 'trigger': 'getItem'}; // 神圣剑
    if (id == 31) tmp.event = {'cls': 'items', 'id': 'shield5', 'trigger': 'getItem'}; // 神圣盾
    if (id == 32) tmp.event = {'cls': 'items', 'id': 'book', 'trigger': 'getItem'}; // 怪物手册
    if (id == 33) tmp.event = {'cls': 'items', 'id': 'fly', 'trigger': 'getItem'}; // 楼层传送器
    if (id == 34) tmp.event = {'cls': 'items', 'id': 'pickaxe', 'trigger': 'getItem'}; // 破墙镐
    if (id == 35) tmp.event = {'cls': 'items', 'id': 'bomb', 'trigger': 'getItem'}; // 炸弹
    if (id == 36) tmp.event = {'cls': 'items', 'id': 'centerFly', 'trigger': 'getItem'}; // 中心对称
    if (id == 37) tmp.event = {'cls': 'items', 'id': 'upFly', 'trigger': 'getItem'}; // 上楼器
    if (id == 38) tmp.event = {'cls': 'items', 'id': 'downFly', 'trigger': 'getItem'}; // 下楼器
    if (id == 39) tmp.event = {'cls': 'items', 'id': 'icePickaxe', 'trigger': 'getItem'}; // 破冰镐
    if (id == 40) tmp.event = {'cls': 'items', 'id': 'coin', 'trigger': 'getItem'}; // 幸运金币
    if (id == 41) tmp.event = {'cls': 'items', 'id': 'snow', 'trigger': 'getItem'}; // 冰冻徽章
    if (id == 42) tmp.event = {'cls': 'items', 'id': 'cross', 'trigger': 'getItem'}; // 十字架
    if (id == 43) tmp.event = {'cls': 'items', 'id': 'superPotion', 'trigger': 'getItem'}; // 圣水
    if (id == 44) tmp.event = {'cls': 'items', 'id': 'greenKey', 'trigger': 'getItem'}; // 绿钥匙
    if (id == 45) tmp.event = {'cls': 'items', 'id': 'steelKey', 'trigger': 'getItem'}; // 铁门钥匙
    if (id == 46) tmp.event = {'cls': 'items', 'id': 'bigKey', 'trigger': 'getItem'}; // 钥匙盒/大黄门钥匙
    if (id == 47) tmp.event = {'cls': 'items', 'id': 'earthquake', 'trigger': 'getItem'} // 地震卷轴

    // 51-80 NPC
    if (id == 51) tmp.event = {'cls': 'npcs', 'id': 'magician', 'trigger': 'visitNpc', 'npcid': 'npc1'};
    if (id == 52) tmp.event = {'cls': 'npcs', 'id': 'magician', 'trigger': 'visitNpc', 'npcid': 'npc2'};
    if (id == 53) tmp.event = {'cls': 'npcs', 'id': 'womanMagician', 'trigger': 'visitNpc', 'npcid': 'npc3'};
    if (id == 54) tmp.event = {'cls': 'npcs', 'id': 'womanMagician', 'trigger': 'visitNpc', 'npcid': 'npc4'};

    // 商店
    if (id == 71) tmp.event = {'cls': 'npcs', 'id': 'blueShop', 'trigger': 'openShop', 'shopid': 'shop1'};
    if (id == 72) tmp.event = {'cls': 'npcs', 'id': 'redShop', 'trigger': 'openShop', 'shopid': 'shop2'};
    if (id == 73) tmp.event = {'cls': 'npcs', 'id': 'womanMagician', 'trigger': 'openShop', 'shopid': 'shop3'};
    if (id == 74) tmp.event = {'cls': 'npcs', 'id': 'blueShop', 'trigger': 'openShop', 'shopid': 'shop4'};
    if (id == 75) tmp.event = {'cls': 'npcs', 'id': 'redShop', 'trigger': 'openShop', 'shopid': 'shop5'};


    // 81-100 门
    if (id == 81) tmp.event = {'cls': 'terrains', 'id': 'yellowDoor', 'trigger': 'openDoor'};
    if (id == 82) tmp.event = {'cls': 'terrains', 'id': 'blueDoor', 'trigger': 'openDoor'};
    if (id == 83) tmp.event = {'cls': 'terrains', 'id': 'redDoor', 'trigger': 'openDoor'};
    if (id == 84) tmp.event = {'cls': 'terrains', 'id': 'greenDoor', 'trigger': 'openDoor'};
    if (id == 85) tmp.event = {'cls': 'terrains', 'id': 'specialDoor', 'trigger': 'openDoor'}; // 商店左
    if (id == 86) tmp.event = {'cls': 'terrains', 'id': 'steelDoor', 'trigger': 'openDoor'}; // 商店左
    if (id == 87) {
        var toFloor = f+1;
        if (f==13) toFloor = 15;
        tmp.event = {
            'cls': 'terrains', 'id': 'upFloor', 'trigger': 'changeFloor', 'noPass': false,
            'data': {'floorId': 'MT' + toFloor, 'stair': 'downFloor'}, 'noTriggerCross': true
        };
    }
    if (id == 88)  {
        var toFloor = f-1;
        if (f==15) toFloor = 13;
        tmp.event = {
            'cls': 'terrains', 'id': 'downFloor', 'trigger': 'changeFloor', 'noPass': false,
            'data': {'floorId': 'MT' + toFloor, 'stair': 'upFloor'}, 'noTriggerCross': true
        };
    }
    // 传送门
    if (id==89) {
        var toFloor = 0, toX = 0, toY = 0;
        if (floorId == "MT17") {toFloor = 21; toX = 9; toY = 9;}
        else if (floorId == "MT21") {toFloor = 17; toX = 11; toY = 5;}
        else if (floorId == "MT19") {toFloor = 20; toX = 6; toY = 9;}
        tmp.event = {
            'cls': 'animates', 'id': 'portal', 'trigger': 'changeFloor', 'noPass': false, 'animate': 4,
            'data': {'floorId': 'MT' + toFloor, 'heroLoc': {'direction': 'up', 'x': toX, 'y': toY}}
        }
    }

    // 101-200 怪物
    if (id == 101) tmp.event = {'cls': 'enemys', 'id': 'greenSlime', 'trigger': 'battle'};
    if (id == 102) tmp.event = {'cls': 'enemys', 'id': 'redSlime', 'trigger': 'battle'};
    if (id == 103) tmp.event = {'cls': 'enemys', 'id': 'blackSlime', 'trigger': 'battle'};
    if (id == 104) tmp.event = {'cls': 'enemys', 'id': 'slimelord', 'trigger': 'battle'};
    if (id == 105) tmp.event = {'cls': 'enemys', 'id': 'bat', 'trigger': 'battle'};
    if (id == 106) tmp.event = {'cls': 'enemys', 'id': 'bigBat', 'trigger': 'battle'};
    if (id == 107) tmp.event = {'cls': 'enemys', 'id': 'redBat', 'trigger': 'battle'};
    if (id == 108) tmp.event = {'cls': 'enemys', 'id': 'vampire', 'trigger': 'battle'};
    if (id == 109) tmp.event = {'cls': 'enemys', 'id': 'bluePriest', 'trigger': 'battle'};
    if (id == 110) tmp.event = {'cls': 'enemys', 'id': 'redPriest', 'trigger': 'battle'};
    if (id == 111) tmp.event = {'cls': 'enemys', 'id': 'brownWizard', 'trigger': 'battle'};
    if (id == 112) tmp.event = {'cls': 'enemys', 'id': 'redWizard', 'trigger': 'battle'};
    if (id == 113) tmp.event = {'cls': 'enemys', 'id': 'skeleton', 'trigger': 'battle'};
    if (id == 114) tmp.event = {'cls': 'enemys', 'id': 'skeletonSoilder', 'trigger': 'battle'};
    if (id == 115) tmp.event = {'cls': 'enemys', 'id': 'skeletonCaptain', 'trigger': 'battle'};
    if (id == 116) tmp.event = {'cls': 'enemys', 'id': 'ghostSkeleton', 'trigger': 'battle'};
    if (id == 117) tmp.event = {'cls': 'enemys', 'id': 'zombie', 'trigger': 'battle'};
    if (id == 118) tmp.event = {'cls': 'enemys', 'id': 'zombieKnight', 'trigger': 'battle'};
    if (id == 119) tmp.event = {'cls': 'enemys', 'id': 'rock', 'trigger': 'battle'};
    if (id == 120) tmp.event = {'cls': 'enemys', 'id': 'slimeMan', 'trigger': 'battle'};
    if (id == 121) tmp.event = {'cls': 'enemys', 'id': 'yellowGuard', 'trigger': 'battle'};
    if (id == 122) tmp.event = {'cls': 'enemys', 'id': 'blueGuard', 'trigger': 'battle'};
    if (id == 123) tmp.event = {'cls': 'enemys', 'id': 'redGuard', 'trigger': 'battle'};
    if (id == 124) tmp.event = {'cls': 'enemys', 'id': 'swordsman', 'trigger': 'battle'};
    if (id == 125) tmp.event = {'cls': 'enemys', 'id': 'soldier', 'trigger': 'battle'};
    if (id == 126) tmp.event = {'cls': 'enemys', 'id': 'yellowKnight', 'trigger': 'battle'};
    if (id == 127) tmp.event = {'cls': 'enemys', 'id': 'redKnight', 'trigger': 'battle'};
    if (id == 128) tmp.event = {'cls': 'enemys', 'id': 'darkKnight', 'trigger': 'battle'};
    if (id == 129) tmp.event = {'cls': 'enemys', 'id': 'redKing', 'trigger': 'battle'};
    if (id == 130) tmp.event = {'cls': 'enemys', 'id': 'whiteKing', 'trigger': 'battle'};
    if (id == 131) tmp.event = {'cls': 'enemys', 'id': 'blackMagician', 'trigger': 'battle'};
    if (id == 132) tmp.event = {'cls': 'enemys', 'id': 'silverSlime', 'trigger': 'battle'};
    if (id == 133) tmp.event = {'cls': 'enemys', 'id': 'poisonSkeleton', 'trigger': 'battle'};
    if (id == 134) tmp.event = {'cls': 'enemys', 'id': 'poisonBat', 'trigger': 'battle'};
    if (id == 135) tmp.event = {'cls': 'enemys', 'id': 'steelRock', 'trigger': 'battle'};
    if (id == 136) tmp.event = {'cls': 'enemys', 'id': 'poisonZombie', 'trigger': 'battle'};
    if (id == 137) tmp.event = {'cls': 'enemys', 'id': 'blackKing', 'trigger': 'battle'};
    if (id == 138) tmp.event = {'cls': 'enemys', 'id': 'yellowKing', 'trigger': 'battle'};
    if (id == 139) tmp.event = {'cls': 'enemys', 'id': 'greenKing', 'trigger': 'battle'};
    if (id == 140) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};

    if (id == 141) tmp.event = {'cls': 'enemys', 'id': 'greenKnight', 'trigger': 'battle'};
    if (id == 142) tmp.event = {'cls': 'enemys', 'id': 'magicDragon', 'trigger': 'battle'};
    if (id == 143) tmp.event = {'cls': 'enemys', 'id': 'octopus', 'trigger': 'battle'};
    if (id == 144) tmp.event = {'cls': 'enemys', 'id': 'fairy', 'trigger': 'battle'};
    if (id == 145) tmp.event = {'cls': 'enemys', 'id': 'whiteGhost', 'trigger': 'battle'};
    if (id == 146) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};
    if (id == 147) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};
    if (id == 148) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};
    if (id == 149) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};
    if (id == 150) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};
    if (id == 151) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};
    if (id == 152) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};
    if (id == 153) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};
    if (id == 154) tmp.event = {'cls': 'enemys', 'id': 'blueKnight', 'trigger': 'battle'};

    // 200+ 特殊

    if (tmp.event == undefined) return null;
    return tmp;
}

maps.prototype.getMaps = function (mapName) {
    if (mapName == undefined) {
        return this.updateNoPass(this.maps);
    }
    return this.maps[mapName];
}

maps.prototype.updateNoPass = function (maps) {
    if (maps.floorId == undefined) {
        for (var floorId in maps) {
            this.updateNoPass(maps[floorId]);
        }
        return maps;
    }
    var blocks = maps['blocks'];
    blocks.forEach(function (t) {
        if (t.event == undefined) return;
        if (t.event.noPass == undefined) {
            if (t.event.cls=='enemys' || t.event.cls=='terrains' || t.event.cls=='npcs') {
                t.event.noPass = true;
            }
        }
        if (t.event.animate == undefined) {
            if (t.event.cls=='enemys' || t.event.cls=='npcs') {
                t.event.animate = 2;
            }
        }
    });
    return maps;
}

maps.prototype.save = function(maps, floorId) {
    if (floorId==undefined || floorId==null) {
        var map = [];
        for (var id in maps) {
            // map[id] = this.save(maps, id);
            map.push(this.save(maps, id));
        }
        return map;
    }
    var thisFloor = maps[floorId];
    var floor = {};
    floor.floorId = thisFloor.floorId;
    floor.name = thisFloor.name;
    floor.title = thisFloor.title;
    floor.canFlyTo = thisFloor.canFlyTo;

    var blocks = [];
    for (var x=0;x<13;x++) {
        blocks[x]=[];
        for (var y=0;y<13;y++) {
            blocks[x].push(0);
        }
    }
    thisFloor.blocks.forEach(function (block) {
        blocks[block.x][block.y] = block.id;
    });
    floor.blocks = blocks;
    return floor;
}

maps.prototype.load = function (data, floorId) {
    if (floorId == undefined) {
        var map = [];
        for (var id in data) {
            map[data[id].floorId] = this.load(data, data[id].floorId);
        }
        return map;
    }
    var x = null;
    for (var id in data) {
        if (data[id].floorId == floorId) {
            x = data[id];
            break;
        }
    }
    if (x==null) return {};

    var content = {};
    content['floorId'] = x.floorId;
    content['name'] = x.name;
    content['title'] = x.title;
    content['canFlyTo'] = x.canFlyTo;
    var blocks = [];
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 13; j++) {
            var id = x.blocks[i][j];
            var block = this.getBlock(x.floorId, x.name, i, j, id);
            if (block!=null) blocks.push(block);
        }
    }
    content['blocks'] = blocks;
    return this.updateNoPass(content);
}

main.instance.maps = new maps();