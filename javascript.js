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

    const children = Array.from(board.children);
    children.forEach(btn => {
        btn.addEventListener('click', () => {
            gameManager.takeTurn(btn);
            // gameConditions.checkForWin(board);
            gameManager.checkConditions(getNumber());
            //console.log(board.getAttribute('class').substr(6));
        });
    });

    function getCell (column, row){
        return (document.querySelector('.b'+board.getAttribute('class').substr(7)+' .c'+column+row)); 
    }

    const winCases = [
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

//console.log(winCases);

    const winPatterns = () => winCases;
    

    return {getNumber, getBoard, getId, winPatterns, winCases};
};


const gameManager = (() => {

    //Variables
    const playerOne = playerFactory('Player One', 'X');
    const playerTwo = playerFactory('player Two', 'O');
    const playerStorage = [playerOne, playerTwo];
    var order = 0;
    const boardStorage = [];
    const test=[];


    //Array of board objects
    for (let i=0; i<document.querySelectorAll('.board').length; i++){
        boardStorage[i] = boardFactory(document.querySelector('.b'+i));
        test[i]  =document.querySelector('.b'+i);
    }

    for (let index = 0; index < test.length; index++){
        //console.log(test[index]);
        //console.log(boardStorage[index].getBoard());
      
    }

    function takeTurn(btn) {
        if(btn.getAttribute('id') == 'marked'){
            return false;
        }
        else
        {
            btn.setAttribute('id', 'marked');
        }
        btn.textContent = playerStorage[order].getSymbol();
        order >= playerStorage.length-1 ? order=0 : order++;
        //checkGameState();
    }

    function checkConditions(boardId){
        gameConditions.checkForWin(boardStorage[boardId]);
    }


    return {takeTurn, checkConditions};
})();

const gameConditions = (() => {

    function checkForWin(board){
       // console.log(board.getBoard().getAttribute('class'));
        //const children = board.getBoard().querySelectorAll('.cell');//document.querySelectorAll('.b'+board.getNumber());
        //console.log(children);
        for(let i=0; i<board.winCases.length; i++){
            if(allEqual(board.winCases[i])){
                board.getBoard().style.backgroundColor = 'purple';
            }
        }
    }

    function checkGameState(){
        for(let i=0; i<boardStorage.length; i++){
            if(boardStorage[i].getId() == 'in-progress' && checkForWin(boardStorage[i].getBoard()) == true){
                // console.log('class: '+boardStorage[i].getClass());
                boardStorage[i].getBoard().style.backgroundColor = 'blue';
                // console.log(boardStorage[i].getClass());
                boardStorage[i].getBoard().setAttribute('id', 'done');
            }
        }
    }

    function allEqual (arr) {
        if(arr[0].textContent == "" || arr[1].textContent == "" || arr[2].textContent == ""){
            return false;
        }
        return (arr[0].textContent == arr[1].textContent && arr[1].textContent == arr[2].textContent);
    }

    return {checkForWin, checkGameState};

})();