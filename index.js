var linkup;
var rows = 7;           // 行数
var cols = 12;          // 列数
var types = 20;         // 方块种类数目
var squareSet;
var chooseOne = null;   // 第一次选中的方块
var chooseTwo = null;   // 第二次选中的方块
var TowardEnum = {
    NONE: null,
    UP: {
        row: -1,
        col: 0
    },
    RIGHT: {
        row: 0,
        col: 1
    },
    DOWN: {
        row: 1,
        col: 0
    },
    LEFT: {
        row: 0,
        col: -1
    }
};

// 判断是否结束，方块是否都消除
function checkFinish() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function getLocaiton(row, col) {
    return "" + row + "," + col;
}

// 判断小方块是否在内容区域内，是否存在这个块
function isExist(row, col) {
    if (row > 0 && row < squareSet.length && col > 0 && col < squareSet[0].length && squareSet[row] && squareSet[row][col]) {
        return true;
    }
    return false;
}

// changeTimes 转弯次数最多为2次

function checkLink(row, col, changeTimes, nowToward, path) { //当前小方块，转弯次数，路径方向(0123上右下左)，所过路径
    if (isExist(row, col) && squareSet[row][col] == chooseTwo && changeTimes <= 3) {
        return true;
    }
    if (isExist(row, col) && squareSet[row][col] != chooseOne || changeTimes > 3 || row < 0 || col < 0 || row >= squareSet.length || col >= squareSet[0].length || path.indexOf(getLocaiton(row, col)) > -1) {
        path.pop();
        return false;
    }
    path.push(getLocaiton(row, col));

    return checkLink(row - 1, col, nowToward == TowardEnum.UP ? changeTimes : changeTimes + 1, TowardEnum.UP, path) //UP
        ||
        checkLink(row, col + 1, nowToward == TowardEnum.RIGHT ? changeTimes : changeTimes + 1, TowardEnum.RIGHT, path) //RIGHT
        ||
        checkLink(row + 1, col, nowToward == TowardEnum.DOWN ? changeTimes : changeTimes + 1, TowardEnum.DOWN, path) //DOWN
        ||
        checkLink(row, col - 1, nowToward == TowardEnum.LEFT ? changeTimes : changeTimes + 1, TowardEnum.LEFT, path) //LEFT
}

// 创建小方块的dom
function createSquare(value, row, col) {
    var temp = document.createElement("div");
    temp.classList.add("square");
    temp.style.left = col * 86 + "px";
    temp.style.top = row * 78 + "px";
    temp.style.backgroundImage = "url('./img/" + value + ".png')";
    temp.num = value;
    temp.row = row;
    temp.col = col;
    return temp;
}

// 消除之后，清除小方块
function clearSquare(row, col) {
    linkup.removeChild(squareSet[row][col]);
    squareSet[row][col] = null;
}

// 初始化方块数字数组
function generateSquareNumSet() {
    var tempSet = [];
    for (var i = 0; i < rows * cols / 2; i++) {
        var tempNum = Math.floor(Math.random() * types);
        tempSet.push(tempNum); // 每次push进入两个相同的方块数值
        tempSet.push(tempNum);
    }
    tempSet.sort(function() {
        return Math.random() - 0.5; // 数组乱序
    });
    return tempSet;
}

// 点击之后的第一个小方块透明度变化
function render() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] && squareSet[i][j] == chooseOne) {
                squareSet[i][j].style.opacity = "0.5";
            } else if (squareSet[i][j]) {
                squareSet[i][j].style.opacity = "1";
            }
        }
    }
}

function initSquareSet() {
    linkup.style.width = 86 * (cols + 2) + "px"; // 为了让div居中
    linkup.style.height = 78 * (rows + 1) + "px";
    var squareNumSet = generateSquareNumSet();
    // 我们会增加上下两行边界，来进行判断连接，所以我们数组的长度是 rows + 2 
    squareSet = new Array(rows + 2); // 创建一个长度为 rows + 2 的数组
    for (var i = 0; i < squareSet.length; i++) {
        squareSet[i] = new Array(cols + 2);
    }
    for (var i = 1; i <= rows; i++) {
        for (var j = 1; j <= cols; j++) {
            var temp = createSquare(squareNumSet.pop(), i, j);
            squareSet[i][j] = temp;
            linkup.appendChild(temp);
            temp.onclick = function() {
                if (chooseOne == null || this.num != chooseOne.num) {
                    chooseOne = this;
                } else {
                    chooseTwo = this;
                    if (chooseOne != chooseTwo && checkLink(chooseOne.row, chooseOne.col, 0, TowardEnum.NONE, [])) { //可以消除
                        clearSquare(chooseOne.row, chooseOne.col);
                        clearSquare(chooseTwo.row, chooseTwo.col);
                    }
                    chooseOne = null;
                    chooseTwo = null;
                }
                render();
                if (checkFinish()) {
                    alert("恭喜获胜~！");
                }
            }
        }
    }
}

function init() {
    linkup = document.getElementById("linkup");
    if (rows * cols % 2 != 0) {
        throw Error("方块数量不能为奇数！");
    }
    initSquareSet();
}

window.onload = function() {
    init();
}