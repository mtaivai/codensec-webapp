import React from 'react';

//import './NIEditor.css'

const unwrap = (container) => {
    let modified = false;
    const parent = container.parentNode;
    while (container.firstChild) {
        parent.insertBefore(container.firstChild, container);
        modified = true;
    }
    return modified;
};


const unwrapAll = (n, filter) => {

    let modified = false;

    let c = n.firstChild;
    while (c) {
        modified |= unwrapAll(c, filter);
        c = c.nextSibling;
    }

    if (!filter || filter(n)) {
        modified |= unwrap(n);
    }

    return modified;
};


// Key shortcut modifiers:
//  alt     The ALT key
//  meta    The META key (CMD, '' on Mac; WINDOWS '' on Windows)
//  shift   The SHIFT key
//  ctrl    The CTRL key
//  cmd     (Custom) Platform-independent: CMD on Mac, CTRL on Windows
const TOOLS = {

    'bold': {
        short: "B",
        exec: 'bold',
        key: 'cmd+b',

        allowDefault: () => false
    },
    'italic': {
        exec: 'italic'
    }
};

const isMacPlatform = true;

class ParsedKey {
    constructor(key) {
        this.altKey = false;
        this.metaKey = false;
        this.shiftKey = false;
        this.ctrlKey = false;
        this.plainKey = true;


        if (key) {

            const components = key.split("+");

            if (isMacPlatform) {
                // cmd ==> meta
            } else {
                // cmd ==> ctrl
            }
            components.forEach((c) => {
                c = c.trim().toLowerCase();
                switch (c) {
                    case 'alt':
                        this.altKey = true;
                        this.plainKey = false;
                        break;
                    case 'meta':
                        this.metaKey = true;
                        this.plainKey = false;
                        break;
                    case 'shift':
                        this.shiftKey = true;
                        this.plainKey = false;
                        break;
                    case 'ctrl':
                        this.ctrlKey = true;
                        this.plainKey = false;
                        break;
                    case 'cmd':
                        if (isMacPlatform) {
                            this.metaKey = true;
                        } else {
                            this.ctrlKey = true;
                        }
                        this.plainKey = false;
                        break;
                    default:
                        this.key = c;

                }
            });
        }
        if (!this.key) {
            console.error("Invalid key specification: '" + key + "' - missing the actual key part");
        }
    }
    matchesKeyboardEvent(e) {
        return (e.altKey === this.altKey
            && e.metaKey === this.metaKey
            && e.shiftKey === this.shiftKey
            && e.ctrlKey === this.ctrlKey
            && e.key.toLowerCase() === this.key);
    }


};


const buildToolsModifierLookup = (tools) => {
    const lookup = {
        'altKey': {},
        'metaKey': {},
        'shiftKey': {},
        'controlKey': {},
        'plain': {}
    };
    for (let toolName in TOOLS) {
        if (!tools.hasOwnProperty(toolName)) {
            continue;
        }
        const tool = tools[toolName];
        const key = tool.key;
        if (!key || !key.key) {
            continue;
        }

        let hasModifier = false;
        if (key.altKey) {
            lookup.altKey[toolName] = tool;
            hasModifier |= true;
        }
        if (key.metaKey) {
            lookup.metaKey[toolName] = tool;
            hasModifier |= true;
        }
        if (key.shiftKey) {
            lookup.shiftKey[toolName] = tool;
            hasModifier |= true;
        }
        if (key.controlKey) {
            lookup.controlKey[toolName] = tool;
            hasModifier |= true;
        }
        if (!hasModifier) {
            lookup.plain[toolName] = tool;
        }
    }
    return lookup;
};
const parseToolKeys = (tools) => {
    for (let toolName in TOOLS) {
        if (!tools.hasOwnProperty(toolName)) {
            continue;
        }
        const tool = tools[toolName];
        tool.key = new ParsedKey(tool.key);
    }
};

parseToolKeys(TOOLS);
const TOOLS_MODIFIER_LOOKUP = buildToolsModifierLookup(TOOLS);



/**
 * Non-invasive editor
 */
class NIEditor extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.editableContainer.setAttribute("contentEditable", "true");
        console.log(this.editableContainer.innerHTML);
        this.sourceContainer.innerHTML = "";
        this.sourceContainer.appendChild(document.createTextNode(this.editableContainer.innerHTML));
    }

    render() {
        const onClick = (e) => {
            // const el = document.getElementById("editable");
            // el.setAttribute("contentEditable", "true");
        };

        const onChange = () => {
            console.log("C");
        };

        const runTool = (name) => {
            const tool = TOOLS[name];


            document.execCommand(tool.exec, true, null);


        };

        const onKeyDown = (e) => {
            console.log('onKeyDown: ' + e.key);

            const plainKey = (e.altKey || e.metaKey || e.ctrlKey);

            if (plainKey) {
                if (e.key === 'Enter') {
                    // If we're inside <p>, insert new <p></p>

                    // If inside <pre>, insert new line

                    console.log(e.target.localName);

                    const sel = window.getSelection();
                    const range = sel.getRangeAt(0); // TODO does this work?

                    // TODO: Range.startContainer is for IE>=9
                    const node = range.startContainer;
                    const parentNode = node.parentNode;
                    console.log(parentNode.localName + " > " + node.localName);
                    const parentName = parentNode.localName.toLowerCase();
                    if (node.localName === 'pre' || parentNode.localName === 'pre') {
                        const foo = document.createTextNode("\n");
                        range.insertNode(foo);
                        range.setStartAfter(foo);
                        range.collapse(true);



                        e.preventDefault();
                    } else {

                    }

                    // If not in paragraph, just insert <br/>

                }
            } else {
                if (e.key === 'b') {

                    //this.toggleInlineElementContainer('STRONG');

                    runTool('bold');

                    e.preventDefault();
                }
            }

            //
            //
            // if (e.metaKey) {
            //     console.log("WITH META: " + e.key);
            //     const k = e.key.toLowerCase();
            //
            //     TOOLS_MODIFIER_LOOKUP.metaKey[k];
            //
            //     e.preventDefault();
            // }

            //TOOLS_MODIFIER_LOOKUP



        };

        const html = this.props.value || "";

        return (
            <div id={"outer"}>
                <div ref={(container) => this.editableContainer = container}
                     className={"NIEditor"}
                     onClick={onClick}
                     onKeyDown={onKeyDown}
                     onChange={onChange}

                    dangerouslySetInnerHTML={{__html: html}}>

                </div>
                <hr/>
                <div>
                    <pre ref={(pre) => this.sourceContainer = pre}/>
                </div>
            </div>
        );

    }
}

export default NIEditor