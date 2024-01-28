//ドラッグアンドドロップについては

//addSubtitleで追加するinputはinput.classNameはjsonのtype、input.valueはjsonのvalueに対応する
//createElementの記述のところ、なぜか一括でオプション設定できない・・・
//ドラッグ＆ドロップの参照　https://jp-seemore.com/web/4702/#toc5

//ボタンを押して追加される要素のclassはcell


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
        cell.style.cursor = 'move';
        cell.style.backgroundColor = 'tarquoise';
        cell.style.display = 'flex';

        var input;
        const grip = document.createElement('div');
        grip.innerHTML = '#';
        grip.draggable = true;

        let dragged;

        // Listen for the dragstart event on the grip
        grip.addEventListener('dragstart', function (e) {
            dragged = cell; // Store the cell being dragged
            e.dataTransfer.effectAllowed = 'move';
        }, false);

        // Listen for the dragover event on the container
        draftContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }, false);

        // Listen for the drop event on the container
        draftContainer.addEventListener('drop', function (e) {
            e.preventDefault();
            if (e.target.className === 'cell' || e.target.parentElement.className === 'cell') {
                let dropTarget = e.target.className === 'cell' ? e.target : e.target.parentElement;
                dropTarget.parentElement.insertBefore(dragged, dropTarget);
            }
        }, false);

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

//ドラッグスタートとドラッグオーバーのイベントリスナーを設定
let dragTarget;
let fileData;

draftContainer.addEventListener('dragstart', e => {
    dragTarget = e.target;
    e.dataTransfer.setData('text/plain', JSON.stringify(draftData));

    // Save the file data
    if (dragTarget instanceof HTMLInputElement && dragTarget.type === 'file') {
        fileData = dragTarget.files;
    }
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

draftContainer.addEventListener('drop', e => {
    // Other drop handling code...

    // After the drop, if the dragTarget was a file input, restore the file data
    if (dragTarget instanceof HTMLInputElement && dragTarget.type === 'file') {
        dragTarget.files = fileData;
    }
});