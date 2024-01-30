//ドラッグアンドドロップについては

//addSubtitleで追加するinputはinput.classNameはjsonのtype、input.valueはjsonのvalueに対応する
//ドラッグ＆ドロップの参照　https://jp-seemore.com/web/4702/#toc5

//dragoverでドロップ先の位置を決定する

//もとになるjsonデータ
const draftData = {
    title: "",
    tag: [],
    date: "",
    section: []
}

const addTag = document.getElementById('addTag');
const tagContainer = document.getElementById('tag-container');
addTag.addEventListener('click', () => {
    const input = document.createElement('input');
    input.className = 'tag';
    tagContainer.appendChild(input);
});

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

        const remove = document.createElement('div');
        remove.innerHTML = '×';
        remove.style.cursor = 'pointer';
        remove.style.marginLeft = 'auto';
        remove.addEventListener('click', () => {
            cell.remove();
        });

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
                // ファイルを選択しなかった場合は、以前のファイルを表示する
                if (input.files.length === 0 && inputFileData[input]) {
                    let dt = new DataTransfer();
                    for (let file of inputFileData[input]) {
                        dt.items.add(file);
                    }
                    input.files = dt.files;
                } else {

                    inputFileData[input] = input.files;

                    // 選択した画像のプレビュー
                    let reader = new FileReader();
                    reader.onloadend = function () {
                        img.src = reader.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                    img.style.width = '100px';
                    img.style.height = 'auto';
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
        cell.appendChild(remove);
    });
});

let dragTarget;

draftContainer.addEventListener('dragstart', (e) => {
    dragTarget = e.target.closest('.cell');
    dragTarget.draggable = true;
    dragTarget.style.backgroundColor = 'lightgreen';
    e.dataTransfer.effectAllowed = 'move';
});

draftContainer.addEventListener('dragover', (e) => {
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
    dragTarget.style.backgroundColor = '';
    dragTarget = null;
});

//追加されたcellをもとにdraftDataを更新する
const title = document.getElementById('draft-title');
const tag = document.getElementById('tag');
const section = document.getElementById('section');
const submitBtn = document.getElementById('submit-button');

submitBtn.addEventListener('click', () => {
    draftData.title = title.value;
    draftData.tag = [];
    draftData.data = new Date();

    const tags = tagContainer.querySelectorAll('.tag');
    tags.forEach((tag) => {
        const value = tag.value;
        draftData.tag.push(value);
    });
    draftData.section = [];
    const cells = draftContainer.querySelectorAll('.cell');
    cells.forEach((cell) => {
        const input = cell.querySelector('input, textarea');
        const type = input.className;
        const value = input.value;
        draftData.section.push({
            type: type,
            value: value
        });
    });
    const json = JSON.stringify(draftData);
    const jsonArea = document.getElementById('json-area');
    jsonArea.textContent = json;
});

