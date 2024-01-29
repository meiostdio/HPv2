//ドラッグアンドドロップについては

//addSubtitleで追加するinputはinput.classNameはjsonのtype、input.valueはjsonのvalueに対応する
//createElementの記述のところ、なぜか一括でオプション設定できない・・・
//ドラッグ＆ドロップの参照　https://jp-seemore.com/web/4702/#toc5

//dragoverでドロップ先の位置を決定する


//もとになるjsonデータ
const draftData = {
    title: "",
    tag: [],
    date: "",
    section: []
}

//ボタンと表示領域の取得
const addSubtitle = document.getElementById('addSubtitle');
const draftContainer = document.getElementById('draft-container');

const addElement = document.getElementById('addElement');
const addElementBtn = addElement.querySelectorAll('button');

let inputFileData = {}; // to store the file data for each input
addElementBtn.forEach((button) => {
    button.addEventListener('click', () => {

        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.draggable = false;
        cell.style.cursor = 'move';
        cell.style.backgroundColor = 'tarquoise';
        cell.style.display = 'flex';


        var input;
        const grip = document.createElement('div');
        grip.draggable = true;
        grip.innerHTML = '#';


        if (button.id === 'addSubtitle') {
            input = document.createElement('input');
            input.className = 'subtitle';
        } else if (button.id === 'addContent') {
            input = document.createElement('textarea');
            input.className = 'content';
        } else if (button.id === 'addImage') {
            input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.className = 'image';
            // Create an img element for the preview
            let img = document.createElement('img');
            img.className = 'preview';
            cell.appendChild(img);

            input.addEventListener('input', function (e) {
                // If no file was selected (user cancelled the file dialog), restore the previous file data
                if (input.files.length === 0 && inputFileData[input]) {
                    let dt = new DataTransfer();
                    for (let file of inputFileData[input]) {
                        dt.items.add(file);
                    }
                    input.files = dt.files;
                } else {
                    // If a file was selected, store it in fileData
                    inputFileData[input] = input.files;

                    // Use FileReader to read the file and create a preview
                    let reader = new FileReader();
                    reader.onloadend = function () {
                        img.src = reader.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            });
        } else if (button.id === 'addCode') {
            input = document.createElement('textarea');
            input.className = 'code';
        } else if (button.id === 'addReference') {
            input = document.createElement('input');
            input.className = 'reference';
        }

        draftContainer.appendChild(cell);
        cell.appendChild(grip);
        cell.appendChild(input);
    });
});

let dragTarget;

draftContainer.addEventListener('dragstart', (e) => {
    dragTarget = e.target.closest('.cell');
    dragTarget.draggable = true;
    e.dataTransfer.effectAllowed = 'move';
});

draftContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const dropTarget = e.target.closest('.cell');
    if (!dropTarget || dropTarget === dragTarget) return;

    const rect = dropTarget.getBoundingClientRect();
    const middleY = (rect.bottom + rect.top) / 2;

    if (e.clientY < middleY) {
        draftContainer.insertBefore(dragTarget, dropTarget);
    } else {
        draftContainer.insertBefore(dragTarget, dropTarget.nextSibling);
    }
});

draftContainer.addEventListener('dragend', (e) => {
    e.preventDefault();
    dragTarget.draggable = false;
    dragTarget = null;
});