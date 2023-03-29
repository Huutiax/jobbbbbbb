/**
 * 等待元素加载完成
 * @param {Object} options
 * {
 *    interval: 运行间隔时间,
 *    timeout: 超时时间（最大运行时间）
 *    selector: 作用的元素,
 *    flag: 定时器id,
 * }
 */
export function waitForElementLoaded({
  interval = 500,
  timeout = 30000,
  selector = null,
  flag = true
}) {
  if (typeof $ === undefined) {
    return;
  }

  let intervalId;
  let times = Math.round(timeout / interval);

  return new Promise(function(resolve, reject) {
    intervalId = setInterval(function() {
      console.log(times, $(selector));
      // 计数为0，就退出（相当于超过了超时时间）
      if (!times) {
        clearInterval(intervalId);
        reject();
      }
      times > 0 && times--;
      console.log("len: ", $(selector).length);
      const hasElement = $(selector).length > 0;
      if ((flag && hasElement) || (!flag && !hasElement)) {
        //判断是否取到
        clearInterval(intervalId);
        resolve(intervalId);
      }
    }, interval);
  });
}
