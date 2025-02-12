const editor = document.getElementById('editor');
const saved = sessionStorage.getItem('editor');

const defaultText = `
❌ Mistake
⭕ Correction
🟦 New word
🔊 Pronunciation
`;

editor.value = saved || defaultText;

function newUnit() {
  const title = prompt('New Unit');
  if (title) {
    const displayRow = ` ${title.trim()} `;
    const line = Array.from(displayRow).map(_ => '*').join('');
    editor.value = `${editor.value}
${line}
${displayRow}
${line}

`;
  }
}

function newWord() {
  const word = prompt('New Word');
  if (word) {
    editor.value = `${editor.value}
🟦 ${word} 🔊[] = `;
  }
}

function newCorrection() {
  editor.value = `${editor.value}
❌
⭕`;
}

const sections = [
    '-- Warm Up --',
    '-- Target Language --',
    '-- Practice A --',
    '-- Practice B --',
    '-- Practice C --',
    '-- Application --',
];

const splitLast = (s, t) => {
    const split = s.split(t);
    return split[split.length - 1];
}

const replaceLast = (s, a, b) => {
    const split = s.split(a);
    if (split.length < 3) {
        return s.replace(a, b);
    }
    const prefix = split.slice(0, -1).join(a);
    return prefix + b + split[split.length - 1];
}

function newSection() {
  const v = splitLast(editor.value, '***').replaceAll('ß', '').trim();

  // when ending with a section replace with next
  for (let i = 0; i < sections.length - 1; i++) {
      const section = sections[i];
      if (v.endsWith(section)) {
          const replacement = sections[i + 1];
          editor.value = replaceLast(editor.value, section, replacement);
          return;
      }
  }

  const sectionIndices = sections.map(section => v.indexOf(section));
  sectionIndices.push(0);
  const maxIndex = Math.max.apply(Math, sectionIndices);
  const v2 = v.substring(maxIndex); // only check last section

  for (let i = sections.length - 1; i >= 0; i--) {
      const thisSection = sections[i];
      const previousSection = sections[i - 1];
      if (i == 0 || v2.includes(previousSection)) {
          editor.value = `${editor.value}
${thisSection}
`;
          return;
      }
  }

}

editor.addEventListener('keydown', (event) => {

  if (event.altKey) {
    if (event.code === 'KeyU') {
      newUnit();
    }
    if (event.code === 'KeyW') {
      newWord();
    }
    if (event.code === 'KeyC') {
      newCorrection();
    }
    if (event.code === 'KeyS') {
      newSection();
    }
  }

  sessionStorage.setItem('editor', event.target.value);

});
