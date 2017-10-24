const QUESTIONSELECTOR = document.querySelector('#questions');

var functionCases = {};
var questions = [
    // {
    //     functionName: '',
    //     functionParameters: [],
    //     question: '',
    //     docText: '',
    //     testcases: [
    //         {
    //             arguments: [],
    //             expectedResult: true,
    //         },
    //     ],
    // },
    {
        functionName: 'add',
        functionParameters: ['a', 'b'],
        text: 'Create a function to add two numbers',
        docText: '',
        testcases: [
            {
                arguments: [1, 2],
                expectedResult: 3,
            },
            {
                arguments: [5, -6],
                expectedResult: -1,
            },
            {
                arguments: [23, 4],
                expectedResult: 27,
            },
        ],
    },
];

for (var i = 0; i < questions.length; i++) {
    var question = questions[i];

    functionCases[question.functionName] = question.testcases;

    var elemText = newQuestion(question.functionName, question.functionParameters, question.text, question.docText);
    var elem = document.createRange().createContextualFragment(elemText);

    var div = elem.querySelector('div');
    var testButton = elem.querySelector('button');
    var message = elem.querySelector('#message');
    var textarea = elem.querySelector('textarea')
    var code = CodeMirror.fromTextArea(
        textarea, {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'mbo',
        styleActiveLine: true,
        lineNumbers: true,
        matchBrackets: true,
        autoRefresh: true,
    });

    var placedElem;
    testButton.onclick = function() {
    	var test = testFunction(question.functionName, code.getValue());

        message.innerText = test.message;
        if (test.passed) {
            div.style.backgroundColor = "#ceffd9"
        } else {
            div.style.backgroundColor = "#ffb0b0"
        }
    }

    QUESTIONSELECTOR.appendChild(elem);
}

function newQuestion(functionName, functionParameters, text, docText) {
    var docCode = "";
    if (docText) {
        docCode = (`
            <div id="document">
                ${docText}
            </div>
        `);
    }

    var elem = (`
        <div id="${functionName}">
            <h3>${functionName}</h3>
            <p>${text}</p>
            ${docCode}
            <textarea>function ${functionName}(${functionParameters.join(', ')}) {\n  return;\n}</textarea>
            <br>
            <p id="message"></p>
            <button>Test!</button>
        </div>
    `)

    return elem;
}

function testFunction(functionName, testFunc, doc) {
    var testDoc;
    if (doc) {
        testDoc = doc.cloneNode(true);
    }

    var testcases = functionCases[functionName];

    for (var i = 0; i < testcases.length; i++) {
        var testcase = testcases[i];
        var fakeWindow = {document: testDoc};

        var result = Function('window', 'document', `
            ${testFunc}
            return ${functionName}.apply(this, ${JSON.stringify(testcase.arguments)})
        `)(fakeWindow, fakeWindow.document)

        if (result != testcase.expectedResult) {
            return {
                passed: false,
                message: `Case failed: ${functionName}(${testcase.arguments}). Value: ${result}, Expected value: ${testcase.expectedResult}`,
            };
        }
    }

    return {
        passed: true,
        message: '',
    };
}
