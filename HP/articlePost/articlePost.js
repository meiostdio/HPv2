//ドラッグアンドドロップについては

//addBtnで追加するinputはinput.classNameはjsonのtype、input.valueはjsonのvalueに対応する
//createElementの記述のところ、なぜか一括でオプション設定できない・・・
//ドラッグ＆ドロップの参照　https://jp-seemore.com/web/4702/#toc5


//もとになるjsonデータ
const draftData = {
    title: "",
    tag: [],
    date: "",
    section: []
}

//ボタンと表示領域の取得
const addBtn = document.getElementById('addBtn');
const draftContainer = document.getElementById('draft-container');

//ボタンを押して、cell{grip, input} になる要素を追加
addBtn.addEventListener('click', () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.draggable = 'true';
    cell.style.cursor = 'move';
    cell.style.backgroundColor = 'tarquoise';
    cell.style.display = 'flex';

    const grip = document.createElement('div');
    grip.innerHTML = '#';

    const input = document.createElement('input');
    input.className = 'content';

    draftContainer.appendChild(cell);
    cell.append(grip, input);

});

//ドラッグスタートとドラッグオーバーのイベントリスナーを設定
let dragTarget;

draftContainer.addEventListener('dragstart', e => {
    dragTarget = e.target;
});

draftContainer.addEventListener('dragover', e => {
    e.preventDefault();

    //ドラッグ中の要素とドロップ先の要素が異なるかチェック
    const dropTarget = e.target.closest('.cell');
    if (!dropTarget || dropTarget === dragTarget) return;

    //ドラッグオーバーが要素の上半分と下半分のどちらにかかっているかで
    //ドラッグしている要素を上と下のどちらにドロップするのかを決定する
    const rect = dropTarget.getBoundingClientRect();
    const middleY = (rect.top + rect.bottom) / 2;

    if (e.clientY < middleY) {
        draftContainer.insertBefore(dragTarget, dropTarget);
    } else {
        draftContainer.insertBefore(dragTarget, dropTarget.nextSibling);
    }
});