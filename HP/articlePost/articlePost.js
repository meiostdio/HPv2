//addBtnで追加するinputはinput.classNameはjsonのtype、input.valueはjsonのvalueに対応する


//メモ：createElementの記述のところ、なぜか一括でオプション設定できない


//もとになるjsonデータ
const draftData = {
    title: "",
    tag: [],
    date: "",
    section: []
}

//ボタンと表示領域の取得
const addBtn = document.getElementById('addBtn');
let draftContainer = document.getElementById('draft-container');


//ボタンを押して、cell{grip, input} になる要素を追加
addBtn.addEventListener('click', () => {
    const cell = document.createElement('div')
    cell.draggable = 'true';
    cell.style.backgroundColor = 'tarquoise';
    cell.style.display = 'flex';

    const grip = document.createElement('div');
    grip.innerHTML = '#';

    const input = document.createElement('input');
    input.className = 'content';

    //ドラッグアンドドロップのときにはcell{dragArea, input}を作り直す必要がある


    grip.addEventListener('dragstart', e => {
        const draggedInputData = e.target.parentNode.querySelector('input');
        e.dataTransfer.setData('text/plain', JSON.stringify({
            className: draggedInputData.className,
            value: draggedInputData.value
        }))

        e.preventDefault();
    })

    cell.addEventListener('drop', e => {
        const dropInputData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const dropCell = document.createElement('div')
        dropCell.draggable = 'true';
        dropCell.style.backgroundColor = 'tarquoise';
        dropCell.style.display = 'flex';

        const dropGrip = document.createElement('div');
        dropGrip.innerHTML = '#';

        const dropInput = document.createElement('input');
        dropInput.className = dropInputData.className;
        dropInput.value = dropInputData.value;

        e.target.insertAdjacentElement('beforebegin', replacedInput7);
        e.preventDefault();
    })


    draftContainer.appendChild(cell);
    cell.append(grip, input)

});







