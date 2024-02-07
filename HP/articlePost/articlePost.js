import { postArticleContent } from "../GithubData.js";

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
    const tagCell = document.createElement('div');
    tagCell.className = 'tag-cell';
    tagContainer.appendChild(tagCell);
    const input = document.createElement('input');
    input.className = 'tag';
    const remove = document.createElement('div');
    remove.innerHTML = '×';
    remove.style.cursor = 'pointer';
    remove.addEventListener('click', () => {
        tagCell.remove();
    });
    tagCell.appendChild(input);
    tagCell.appendChild(remove);
});

//ボタンと表示領域の取得
const addSubtitle = document.getElementById('addSubtitle');
const draftContainer = document.getElementById('draft-container');

const addElement = document.getElementById('addElement');
const addElementBtn = addElement.querySelectorAll('button');

addElementBtn.forEach((button) => {
    
    button.addEventListener('click', () => {
        //テキストコンテントの追加
        if (button.classList.contains('text')) {
            const cell = creatCellAndGrip();
            const remove = createRemoveElement(cell);
            const inputTag = button.classList.contains('input') ? 'input' : 'textarea';
            const input = document.createElement(inputTag);
            input.className = button.id;
            cell.appendChild(input);
            cell.appendChild(remove);
        }
        else if (button.id === 'link') {
            const cell = creatCellAndGrip();
            const remove = createRemoveElement(cell);
            const inputField = document.createElement('div');
            const linkedTextInput = document.createElement('input');
            linkedTextInput.className = 'linked-text';
            const linkedUrlInput = document.createElement('input');
            linkedUrlInput.className = 'linked-url';

            cell.appendChild(inputField);
            inputField.appendChild(linkedTextInput);
            inputField.appendChild(linkedUrlInput);
            cell.appendChild(remove);
        }
        //画像の追加
        else if (button.id === 'image') {
            const inputFileData = {};
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.className = 'image';
            input.style.display = 'none';

            // Create an img element for the preview
            let img = document.createElement('img');
            img.className = 'preview';
            img.addEventListener('click', () => {
                input.click();
            });

            input.addEventListener('input', function (e) {
                // ファイルを選択しなかった場合は、以前のファイルを表示する
                if (input.files.length === 0 && inputFileData[input]) {
                    let dt = new DataTransfer();
                    for (let file of inputFileData[input]) {
                        dt.items.add(file);
                    }
                    input.files = dt.files;
                } else if (!inputFileData[input]) {
                    // そのinput要素にまだファイルが選択されていない場合

                    inputFileData[input] = input.files;

                    // 選択した画像のプレビュー
                    let reader = new FileReader();
                    reader.onloadend = function () {
                        img.src = reader.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                    img.style.width = '100px';
                    img.style.height = 'auto';
                    const cell = creatCellAndGrip();
                    const remove = createRemoveElement(cell);
                    cell.appendChild(img);
                    cell.appendChild(input);
                    cell.appendChild(remove);
                }
                else {
                    //そのinput要素にすでにファイルが選択されている場合
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

            input.click();
        }
    });
});

function creatCellAndGrip() {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.draggable = false;
    cell.style.cursor = 'move';
    cell.style.backgroundColor = 'tarquoise';
    cell.style.display = 'flex';
    cell.style.alignItems = 'center';
    draftContainer.appendChild(cell);

    const grip = document.createElement('div');
    grip.className = 'grip';
    grip.draggable = true;
    grip.innerHTML = ':::';
    cell.appendChild(grip);

    return cell;
}

function createRemoveElement(cell) {
    const remove = document.createElement('div');
    remove.className = 'remove';
    remove.innerHTML = '×';
    remove.style.cursor = 'pointer';
    remove.addEventListener('click', () => {
        cell.remove();
    });
    return remove;
}

let dragTarget;

//grip要素を掴ませて、cellが動くようにする
draftContainer.addEventListener('dragstart', (e) => {
    dragTarget = e.target.closest('.cell');
    dragTarget.draggable = true;
    dragTarget.style.backgroundColor = 'lightgreen';
    e.dataTransfer.effectAllowed = 'move';
});

//ドラッグした要素がドロップする位置を決める
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

//ドラッグ完了による初期化
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

submitBtn.addEventListener('click', async () => {
    draftData.title = title.value;
    draftData.tag = [];
    draftData.date = formatDate(new Date());

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

    await postArticleContent(json);
});

function formatDate(date) {
    const y = date.getFullYear();
    const m = ("00" + (date.getMonth() + 1)).slice(-2);
    const d = ("00" + date.getDate()).slice(-2);
    return `${y}${m}${d}`;
}