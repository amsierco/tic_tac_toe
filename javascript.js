const playerFactory = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol};
};


//Board Factory
const boardFactory = board => {

    const getNumber = () => board.getAttribute('class').substr(7);
    const getId = () => board.getAttribute('id');
    const getBoard = () => board;
    const getChildren = () => children;
    const children = Array.from(board.children);

    children.forEach(btn => {
        btn.addEventListener('click', () => {
            if(board.getAttribute('id') == 'in-progress' &&
               btn.getAttribute('id') == 'unmarked'){
                btn.setAttribute('id', 'marked');
                gameManager.takeTurn(btn);
                gameManager.checkConditions(getNumber());
            }
        });
    });

    function getCell (column, row){
        return (document.querySelector('.b'+board.getAttribute('class').substr(7)+' .c'+column+row)); 
    }

    const localWinCases = [
        //Columns
        [getCell(0,0),getCell(0,1),getCell(0,2)],
        [getCell(1,0),getCell(1,1),getCell(1,2)],
        [getCell(2,0),getCell(2,1),getCell(2,2)],
        //Rows
        [getCell(0,0),getCell(1,0),getCell(2,0)],
        [getCell(0,1),getCell(1,1),getCell(2,1)],
        [getCell(0,2),getCell(1,2),getCell(2,2)],
        //Diagonal
        [getCell(0,0),getCell(1,1),getCell(2,2)],
        [getCell(0,2),getCell(1,1),getCell(2,0)],
    ]; 

    return {getNumber, getBoard, getId, getChildren, localWinCases};
};


const gameManager = (() => {

    //Variables
    const playerOne = playerFactory('Player One', 'X');
    const playerTwo = playerFactory('player Two', 'O');
    const playerStorage = [playerOne, playerTwo];
    var order = 0;
    const boardStorage = [];

    //Create an array of game boards
    for (let i=0; i<document.querySelectorAll('.board').length; i++){
        boardStorage[i] = boardFactory(document.querySelector('.b'+i));
    }

    //Add's player's symbol to board
    function takeTurn(btn) {
        btn.textContent = playerStorage[order].getSymbol();
        order >= playerStorage.length-1 ? order=0 : order++;
    }

    //Checks conditions on specific boards based board button inputs
    function checkConditions(boardId){
        gameConditions.checkForWin(boardStorage[boardId]);
        gameConditions.bigWin();
    }

    return {takeTurn, checkConditions};
})();

const gameConditions = (() => {

    //Checks for individual board victories
    function checkForWin(board){
        for(let i=0; i<board.localWinCases.length; i++){
            if(allEqual(board.localWinCases[i])){
                console.log(board.getBoard().getAttribute('class').substr(6)+' has completed!');
                board.getBoard().setAttribute('id', 'done'+board.localWinCases[i][0].textContent);
                makeBig(board, board.localWinCases[i][0].textContent);
                return true;
            }
        }
    }

    function allEqual (arr) {
        if(arr[0].textContent == "" || arr[1].textContent == "" || arr[2].textContent == ""){
            return false;
        }
        return (arr[0].textContent == arr[1].textContent && arr[1].textContent == arr[2].textContent);
    }

    function makeBig(board, symbol){
        if(symbol == 'O'){
            board.getChildren()[4].style.background = 'transparent';
        } else if (symbol == 'X'){
            board.getChildren()[1].style.background = 'transparent';
            board.getChildren()[3].style.background = 'transparent';
            board.getChildren()[5].style.background = 'transparent';
            board.getChildren()[7].style.background = 'transparent';
        }

        for(let child of board.getChildren()){
            child.textContent = '';
        }
    }

    function allEqualLarge (arr) {
        if(arr[0] == 'flase' || arr[1] == 'false' || arr[2] == 'false'){
            return false;
        }
        else if(arr[0].getAttribute('id').substr(4) == 'false' || arr[1].getAttribute('id').substr(4) == 'false' || arr[2].getAttribute('id').substr(4) == 'false'){
            return false;
        } else {
            arr[0].style.backgroundColor = 'rgba(100,255,100,1);';
            arr[1].style.backgroundColor = 'rgba(100,255,100,1);';
            arr[2].style.backgroundColor = 'rgba(100,255,100,1);';
            return (arr[0].getAttribute('id').substr(4) == arr[1].getAttribute('id').substr(4) && arr[1].getAttribute('id').substr(4) == arr[2].getAttribute('id').substr(4));
        }
    }

    function getCell (b){
        if(document.querySelector('.b'+b).getAttribute('id') == 'in-progress'){
            return 'false';
        }
        return (document.querySelector('.b'+b)); 
    }

    function bigWin(){
        let globalWinCases = [
            //Columns
            [getCell(0),getCell(3),getCell(6)],
            [getCell(1),getCell(4),getCell(7)],
            [getCell(2),getCell(5),getCell(8)],
            //Rows
            [getCell(0),getCell(1),getCell(2)],
            [getCell(3),getCell(4),getCell(5)],
            [getCell(6),getCell(7),getCell(8)],
            //Diagonal
            [getCell(0),getCell(4),getCell(8)],
            [getCell(6),getCell(4),getCell(2)],
        ]; 


        for(let i=0; i<globalWinCases.length; i++){
            if(allEqualLarge(globalWinCases[i]) == true){
                console.log("Mega Winner: "+globalWinCases[i][0].getAttribute('id').substr(4));
                return true;
            }
        }
    }

    return {checkForWin, bigWin};

})();