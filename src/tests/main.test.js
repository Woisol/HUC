const appConfig = require("../../main.js");
const toQueryString = require("../../main.js");
const adjudgeDateBy4 = require("../../main.js");
// ！emm这个jest报错说需要ts-node来测试…………
test('appConfig Read Well!', () => {
	expect(appConfig).toBeDefined();
	expect(appConfig).toContain('StartBoot');
})
test('toQueryString return Successfully', () => {
	expect(toQueryString(new Date(2024, 3, 28, 15))).toBe(" BETWEEN '2024-3-18 04:00:00' AND '2024-3-19 04:00:00");
	expect(toQueryString(new Date(2024, 3, 28, 3))).toBe(" BETWEEN '2024-3-17 04:00:00' AND '2024-3-18 04:00:00");
})