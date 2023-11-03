const assert = require('assert');
const { MermaidFormatter } = require('./MermaidFormatter'); // パスはMermaidFormatterクラスの実際の場所に置き換えてください。

// テストの実行と検証を行うヘルパー関数
function testFormatter(input, expected) {
    const formatter = new MermaidFormatter();
    const output = formatter.convertToMermaid(input);
    assert.strictEqual(output, expected);
}

// 個別のテストケースを定義する関数
function testCase1() {
    // テストケース1: 単純な 'step'
    const input = `
食材の購入
混ぜる
盛り付ける
`;

    const expected =
        `code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2[混ぜる]
 2 --> 3[盛り付ける]`;

    testFormatter(input, expected);
}

function testCase2() {
    // テストケース2: 単純な 'if' と 'step'
    const input = `
    食材の購入
    if 肉が早く炒め終わる
    yes 肉のフライパンに野菜を入れる
    no 野菜のフライパンに肉を入れる
    空いたコンロでルーを煮込む
    混ぜる
    盛り付ける
    `;

    const expected =
`code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2{肉が早く炒め終わる}
 2 --> |yes| 3[肉のフライパンに野菜を入れる]
 2 --> |no| 4[野菜のフライパンに肉を入れる]
 3 --> 5[空いたコンロでルーを煮込む]
 4 --> 5[空いたコンロでルーを煮込む]
 5 --> 6[混ぜる]
 6 --> 7[盛り付ける]`;

    testFormatter(input, expected);
}

function testCase3() {
    const input = `
    食材の購入
    混ぜる & かき混ぜる
    盛り付ける
    `;

    const expected =
`code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2[混ぜる & かき混ぜる]
 2 --> 3[盛り付ける]`;

    testFormatter(input, expected);
}

function testCase4() {
    // テストケース4: 'if'あり、かつ'step'に空白が含まれる
    const input = `
    食材の購入
    if 肉が早く炒め終わる
     yes 肉のフライパンに野菜を入れる
     no 野菜のフライパンに肉を入れる
    空いたコンロでルー & 米を煮込む
    混ぜる
    盛り付ける
    `;

    const expected =
`code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2{肉が早く炒め終わる}
 2 --> |yes| 3[肉のフライパンに野菜を入れる]
 2 --> |no| 4[野菜のフライパンに肉を入れる]
 3 --> 5[空いたコンロでルー & 米を煮込む]
 4 --> 5[空いたコンロでルー & 米を煮込む]
 5 --> 6[混ぜる & かき混ぜる]
 6 --> 7[盛り付ける]`;

    testFormatter(input, expected);
}

// 全テストケースを実行する関数
function runAllTests() {
    console.log('case1');
    testCase1();
    console.log('case2');
    testCase2();
    console.log('case3');
    testCase3();
    console.log('case4')
      testCase4();
    console.log('All tests passed!');
}

runAllTests();

