const range1 = x => {
    const out = [];
    for (let i = 1; i <= x; i++) {
        out.push(i);
    }
    return out;
}

const editor = document.getElementById('editor');
const saved = localStorage.getItem('editor');

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
    editor.value = `${editor.value}${line}
${displayRow}
${line}

`;
  }
}

function newWord() {
  const word = prompt('New Word');
  if (word) {
    editor.value = `${editor.value}🟦 ${word} 🔊[] = `;
  }
}

function newCorrection() {
  editor.value = `${editor.value}❌
⭕`;
}

const sectionsDefault = [
    '-- Warm Up --',
    '-- Target Language --',
    '-- Practice A --',
    '-- Practice B --',
    '-- Practice C --',
    '-- Application --',
];

const sectionsReview = [
    '-- Warm Up --',
    ...(range1(20).map (x => `-- Scene ${x} --`))
];

const replaceLast = (s, a, b) => {
    const split = s.split(a);
    if (split.length < 3) {
        return s.replace(a, b);
    }
    const prefix = split.slice(0, -1).join(a);
    return prefix + b + split[split.length - 1];
}

const maxIndexOf = (s, a) => {
    const index = s.indexOf(a);
    if (index == -1) {
        return -1;
    }
    const restOfString = s.substring(index + a.length);
    const subsequentIndex = maxIndexOf(restOfString, a);
    if (subsequentIndex > -1) {
        return subsequentIndex + index + a.length;
    } else {
        return index;
    }
}

function getUnit() {
    const lines = editor.value.split('\n');
    for (let i = lines.length - 1; i > 0; i--) {
        const line = lines[i];
        if (line.startsWith('***')) {
            return lines[i - 1];
        }
    }
    return '';
}

function getLastSection() {
    const lines = editor.value.split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (line.startsWith('***')) {
            return lines.slice(i + 1).join('\n');
        }
    }
    return editor.value;
}

function newSection() {
  const v = getLastSection().replaceAll('ß', '').trim();
  const sections = getUnit().toLowerCase().trim() == 'review' ? sectionsReview : sectionsDefault;

  // when ending with a section replace with next
  for (let i = 0; i < sections.length - 1; i++) {
      const section = sections[i];
      if (v.endsWith(section)) {
          const replacement = sections[i + 1];
          editor.value = replaceLast(editor.value, section, replacement);
          return;
      }
  }

  const sectionIndices = sections.map(section => maxIndexOf(v, section));
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

  localStorage.setItem('editor', event.target.value);

});
