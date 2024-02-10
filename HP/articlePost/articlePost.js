import { postArticleContent, postArticleImage } from "../GithubData.js";

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
    remove.addEventListener('mouseover', () => {
        tagCell.style.backgroundColor = '#a1a1a1';
        input.style.backgroundColor = '#e3e3e3';
    });
    remove.addEventListener('mouseout', () => {
        tagCell.style.backgroundColor = '';
        input.style.backgroundColor = '';
    });
    tagCell.appendChild(input);
    tagCell.appendChild(remove);
});

//ボタンと表示領域の取得

const draftContainer = document.getElementById('draft-container');
const addBtns = document.getElementById('addBtn');
const addBtn = addBtns .querySelectorAll('button');

addBtn.forEach((button) => {

    button.addEventListener('click', () => {
        //テキストコンテントの追加
        if (button.classList.contains('text')) {
            const cell = creatCellAndGrip(button.classList[0]);
            const remove = createRemoveElement(cell);
            const inputTag = button.classList.contains('input') ? 'input' : 'textarea';
            const input = document.createElement(inputTag);
            input.className = button.id;
            input.placeholder = button.id;
            cell.appendChild(input);
            cell.appendChild(remove);
        }
        else if (button.id === 'link') {
            const cell = creatCellAndGrip(button.classList[0]);
            const remove = createRemoveElement(cell);
            const inputField = document.createElement('div');
            const linkedTextInput = document.createElement('input');
            linkedTextInput.className = 'linked-text';
            linkedTextInput.placeholder = 'linked-text';
            const linkedUrlInput = document.createElement('input');
            linkedUrlInput.className = 'linked-url';
            linkedUrlInput.placeholder = 'linked-url';

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
                    const cell = creatCellAndGrip(button.classList[0]);
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

function creatCellAndGrip(buttonClass) {
    const cell = document.createElement('div');
    cell.className = 'cell ' + buttonClass;
    cell.draggable = false;
    cell.style.cursor = 'move';
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
    remove.addEventListener('mouseover', () => {
        cell.style.backgroundColor = '#e3e3e3';
    });
    remove.addEventListener('mouseout', () => {
        cell.style.backgroundColor = '';
    });
    return remove;
}

let dragTarget;

//grip要素を掴ませて、cellが動くようにする
draftContainer.addEventListener('dragstart', (e) => {
    dragTarget = e.target.closest('.cell');
    dragTarget.draggable = true;
    dragTarget.style.backgroundColor = '#e3e3e3';
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
const title = document.getElementById('title');
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
    let imageNumber = 1;
    cells.forEach((cell) => {
        if (cell.classList.contains('text')) {
            const input = cell.querySelector('input, textarea');
            const type = input.className;
            const value = input.value;
            draftData.section.push({
                type: type,
                value: value
            });
        }
        else if (cell.classList.contains('link')) {
            const linkedText = cell.querySelector('.linked-text').value;
            const linkedUrl = cell.querySelector('.linked-url').value;
            draftData.section.push({
                type: 'link',
                value: linkedText,
                url: linkedUrl
            });
        }
        else if (cell.classList.contains('image')) {
            const input = cell.querySelector('input');
            // 画像名をarticle{number}の形式で与える
            const imageName = `article${imageNumber++}`;
            const imageExtension = input.value.split('.').pop();
            const imageFullName = `${imageName}.${imageExtension}`;

            const type = input.className;
            const value = imageFullName;

            draftData.section.push({
                type: type,
                value: value
            });
        }
    });
    const json = JSON.stringify(draftData);
    const jsonArea = document.getElementById('json-area');
    jsonArea.textContent = json;

    document.getElementById('thumbnail-dialog').style.display = 'block';
    //  *** ここで画像を圧縮する ***
    // const imagesBase64 = await getImagesFromDraftContainer();
    // let compressedImagesPromises = imagesBase64.map(compressImage);
    // let compressedImagesBase64 = await Promise.all(compressedImagesPromises);
    
    // *** ここで記事データをGitHubに保存する ***
    // const response = await postArticleContent(draftData);
    // if (response) {
    //     alert('記事を投稿しました');
    // } else {
    //     alert('記事の投稿に失敗しました');
    // }
    
    // *** ここで記事に使用する画像をGitHubに保存する ***
    // const imagesBase64 = await getImagesFromDraftContainer();
    // imagesBase64.forEach(async (base64, index) => {
    //     //const resposnse = await postArticleImage('article11', `article${index+1}.png`, base64);
    //     console.log(resposnse);
    // });
});

function formatDate(date) {
    const y = date.getFullYear();
    const m = ("00" + (date.getMonth() + 1)).slice(-2);
    const d = ("00" + date.getDate()).slice(-2);
    return `${y}${m}${d}`;
}
<<<<<<< HEAD
=======

// サムネイルのダイアログで選択ボタンを押したとき
// サムネイルのダイアログで選択ボタンを押したとき
document.getElementById('selent-thumbnail').addEventListener('click', function() {
    // 非表示のinput要素をクリックする
    document.getElementById('thumbnail-dialog-input').click();
});

// 非表示のinput要素でファイルが選択されたとき
document.getElementById('thumbnail-dialog-input').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    const base64 = await toBase64(file);
    console.log('圧縮前の画像:',base64);
    const compressedImageBase64 = await compressImage(base64);
    console.log('圧縮後の画像:',compressedImageBase64);
});


// サムネイルのダイアログを閉じる
document.getElementById('close-thumbnail-dialog').addEventListener('click', () => {
    document.getElementById('thumbnail-dialog').style.display = 'none';
});

// fileをbase64に変換する
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function() {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 作成されたdraft-conainerから画像を取得してbase64形式で返す
async function getImagesFromDraftContainer() {
    let imageBase64 = [];
    const images = draftContainer.querySelectorAll('.image');
    for (let image of images) {
        if (image.files && image.files[0]) {
            const file = image.files[0];
            const Base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = e => reject(e.target.error);
                reader.readAsDataURL(file);
            });
            imageBase64.push(Base64);
        } else {
            console.log('No file associated with this image element');
        }
    }  
    console.log('圧縮前の画像:',imageBase64);
    return imageBase64;
}

// 画像を圧縮してbase64形式で返す
async function compressImage(base64) {
    const maxWidth = 800; // Maximum width
    const maxHeight = 800; // Maximum height

    // Load the image into a new Image object
    const img = new Image();
    img.src = base64;
    await new Promise(resolve => img.onload = resolve);

    // Determine if the image needs to be resized
    let width = img.width;
    let height = img.height;

    if (width > height) {
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
    }

    // Create a canvas and draw the resized image onto it
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    // Get the result as a base64 string
    const resizedBase64 = canvas.toDataURL('image/png');
    return resizedBase64;
}
>>>>>>> 2d9edbe58dec9959407aa28655e22f097893f309
