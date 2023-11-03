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
 4 --> 5[空いたコンロでルーを煮込む]
 3 --> 5[空いたコンロでルーを煮込む]
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
 4 --> 5[空いたコンロでルー & 米を煮込む]
 3 --> 5[空いたコンロでルー & 米を煮込む]
 5 --> 6[混ぜる]
 6 --> 7[盛り付ける]`;

    testFormatter(input, expected);
}

function testCase5() {
    // 'if'に空白が含まれる
    const input = `
    食材の購入
    if 肉 & サラダが早く炒め終わる
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
 1 --> 2{肉 & サラダが早く炒め終わる}
 2 --> |yes| 3[肉のフライパンに野菜を入れる]
 2 --> |no| 4[野菜のフライパンに肉を入れる]
 4 --> 5[空いたコンロでルー & 米を煮込む]
 3 --> 5[空いたコンロでルー & 米を煮込む]
 5 --> 6[混ぜる]
 6 --> 7[盛り付ける]`;

    testFormatter(input, expected);
}

function testCase6() {
    // 'if'に空白が含まれる
    const input = `
    食材の購入
    if 肉 & サラダが早く炒め終わる
     yes 肉のフライパンに野菜を入れる
     no 野菜のフライパンに肉を入れる
     other 気合を入れる
    空いたコンロでルー & 米を煮込む
    混ぜる
    盛り付ける
    `;

    const expected =
`code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2{肉 & サラダが早く炒め終わる}
 2 --> |yes| 3[肉のフライパンに野菜を入れる]
 2 --> |no| 4[野菜のフライパンに肉を入れる]
 2 --> |other| 5[気合を入れる]
 5 --> 6[空いたコンロでルー & 米を煮込む]
 3 --> 6[空いたコンロでルー & 米を煮込む]
 4 --> 6[空いたコンロでルー & 米を煮込む]
 6 --> 7[混ぜる]
 7 --> 8[盛り付ける]`;

    testFormatter(input, expected);
}

function testCase9() {
    // 'if'に空白が含まれる
    const input = `
    　 カレーの設計
    　 食材の購入
    　 
    　 　野菜の炒め
    　 　	にんじん
    　 　	玉ねぎ
    　 　肉の炒め
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
 1[カレーの設計]
 --> 2[食材の購入]
 2 --> [ ]
 subgraph 野菜の炒め
 3 --> 4[人参] --> 6[ ]
 3 --> 5[玉ねぎ] --> 6[ ]
 end
 2 --> 7[肉の炒め]
 6 --> 8{肉が早く炒め終わる}
 7 --> 8
 8 --> |yes| 9[肉のフライパンに野菜を入れる]
 8 --> |no| 10[野菜のフライパンに肉を入れる]
 9 --> 11[空いたコンロでルーを煮込む]
 10 --> 11
 --> 12[混ぜる]
 --> 13[盛り付ける]`;

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
    console.log('case5')
    testCase5();
    console.log('case6')
    testCase6();
    console.log('All tests passed!');
}

runAllTests();

