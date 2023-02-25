const playerFactory = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol};
};

const gameManager = (() => {

    //Local Factories
    const boardFactory = (board) => {
        const getId = () => board.getAttribute('id').substr(1);
        for (let btn of board.children){
            btn.addEventListener('click', () => {
                if(btn.getAttribute('id') != 'marked'){
                    takeTurn(btn);
                }
                btn.setAttribute('id', 'marked');
            });
        }

        function content (column, row){
            return (document.querySelector('.'+board.getAttribute('class').substr(0,5)+' .c'+column+row));    //('#'+column+'-'+row));
        }

        var directions = [
            //Columns
            [content(0,0),content(0,1),content(0,2)],
            [content(1,0),content(1,1),content(1,2)],
            [content(2,0),content(2,1),content(2,2)],
            //Rows
            [content(0,0),content(1,0),content(2,0)],
            [content(0,1),content(1,1),content(2,1)],
            [content(0,2),content(1,2),content(2,2)],
            //Diagonal
            [content(0,0),content(1,1),content(2,2)],
            [content(0,2),content(1,1),content(2,0)],
        ];
        return {getId, directions};
    };

    //Temporary players
    const playerOne = playerFactory('Player One', 'X');
    const playerTwo = playerFactory('player Two', 'O');
    //const playerThree = playerFactory('player Three', 'Y');
    const playerStorage = [playerOne, playerTwo];//, playerThree];
    var order = 0;

    //Array of board objects
    const boardStorage = [];
    for (let i=0; i<document.querySelectorAll('.board').length; i++){
        boardStorage[i] = boardFactory(document.querySelectorAll('.board')[i]);
    }

    function takeTurn(btn) {
        btn.textContent = playerStorage[order].getSymbol();
        btn.style.cssText = 'font-size: 2rem;';
        if(order >= playerStorage.length-1){
            order = 0;
        } 
        else {
            order++;
        }
        checkGameState();
    }

    function allEqual (arr) {
        if(arr[0].textContent == "" || arr[1].textContent == "" || arr[2].textContent == ""){
            return false;
        }
        return (arr[0].textContent == arr[1].textContent && arr[1].textContent == arr[2].textContent);
    }

    function checkGameState(){
        for(let i=0; i<boardStorage.length; i++){
            let toCheck = boardStorage[i].directions;
            for(let i of toCheck){
                if(allEqual(i) == true){
                    console.log('VICTOR HAS OCCURED! '+ i[0].textContent);
                }
            }
        }
    }
})();

