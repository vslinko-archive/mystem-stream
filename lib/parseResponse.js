/**
 * Node.js wrapper for `MyStem` morphology text analyzer.
 * Copyright Vyacheslav Slinko <vyacheslav.slinko@gmail.com>
 */

function parseResponse(mystemResponse) {
    var mystemResponseFacts = mystemResponse.slice(mystemResponse.indexOf("{") + 1, -1),
        factRegexp = /([^,]+\([^)]+\)|[^,]+)/g,
        facts = [],
        fact;

    while (fact = factRegexp.exec(mystemResponseFacts)) {
        facts.push(fact[0]);
    }

    var result = {
        mystemResponse: mystemResponse,
        facts: facts.concat()
    };

    var firstFact = facts.shift().split('=');
    result.stem = firstFact[0].replace(/\?*$/, "");

    return result;
}


module.exports = parseResponse;
