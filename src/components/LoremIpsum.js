import React from 'react';

const LoremIpsum_P = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et vehicula mauris. Nullam eros tortor, faucibus fermentum odio blandit, sollicitudin semper mi. Suspendisse felis magna, lacinia nec fringilla vitae, maximus quis orci. Nulla sollicitudin, dui vel vestibulum fermentum, nisl justo volutpat mauris, nec placerat libero orci id ex. Mauris suscipit varius dignissim. Nullam ut ultricies massa. Fusce ut sem molestie, tincidunt ipsum quis, maximus felis.";
const LoremIpsum_WORDS = LoremIpsum_P.split(/\s+/);


const LoremIpsum = ({paragraphs = 1, words = -1, ...props}) => {
    const elems = [];

    if (paragraphs && words !== 0) {

        const wordArr = LoremIpsum_WORDS;
        const wordCount = wordArr.length;

        if (words < 0) {
            words = wordCount;
        }

        let p = "";
        for (let i = 0; i < words; i++) {
            if (i > 0) {
                p = p + " ";
            }
            p = p + wordArr[i >= wordCount ? i % wordCount : i];
        }

        for (let i = 0; i < paragraphs; i++) {

            elems.push(<p key={i}>{p}</p>);
        }
    }

    return elems;
};

export default LoremIpsum;
