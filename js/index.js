var functionCases = {};

function newQuestion(functionName, question, testcases) {
    functionCases[functionName] = testcases;

    var elem = (`
        <div id="${functionName}">
            <h3>${functionName}</h3>
            <p>${question}</p>
            <textarea>
                function ${functionName}() {

                }
            </textarea>
        </div>
    `)

    return elem;
}

function testFunction(functionName, testFunc, doc) {
    var testDoc = doc.cloneNode(true)
    var testcases = functionCases[functionName];

    for (var i = 0; i < testcases.length; i++) {
        var case = testcases[i];
        var fakeWindow = {document: testDoc};

        // We'll see how well my sandboxing works...
        var caseResult = (function(window, document, testFunc, case) {
            return func.apply(this, case.arguments);
        }).call(fakeWindow, fakeWindow, fakeWindow.document, testFunc, case);

        if (caseResult != case.expectedResult) {
            return false;
        }
    }

    return true;
}
