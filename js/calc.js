(function () {
 /**
  * 
  * @param {*} nums 数据
  * @param {*} target 目标值
  * @param {*} mode 模式greater/less/closest
  * @param {*} error_threshold 误差阈值
  * @returns 
  */
 function calc (nums, target, mode = 'closest', error_threshold = 0) {
  var _nums_len = nums.length
  var len = Math.pow(2, _nums_len)

  function strToLen (str, len) {
   var _len = str.length
   if (_len < len) {
    return '0'.repeat(len - _len) + str
   } else {
    return str.slice(0, len)
   }
  }

  var minArr = []
  var min = target * 10
  if( mode === 'less') {
   min = 0 
  }
  for (let i = 0; i < len; i++) {
   var _num = strToLen(i.toString(2), _nums_len)

   let sum = 0, _tempArr = []
   _num.split('').forEach((item, index) => {
    if (item === '1') {
     sum += nums[index]
     _tempArr = [..._tempArr, nums[index]]
    }
   })
   if (mode === 'closest') {
    if(Math.abs(sum - target) <= error_threshold) {
     min = sum
     minArr = _tempArr
     break
    } else if(Math.abs(sum - target) < Math.abs(min - target)) {
     min = sum
     minArr = _tempArr
    }
   } else if (mode === 'greater') {
    if (sum >= target && sum-target <= error_threshold) {
     min = sum
     minArr = _tempArr
     break
    } else if(sum >= target && sum - target < min - target) {
     min = sum
     minArr = _tempArr
    }
   } else if (mode === 'less') {
    if (sum <= target && target - sum <= error_threshold) {
     min = sum
     minArr = _tempArr
     break
    } else if(sum <= target && target - sum < target - min) {
     min = sum
     minArr = _tempArr
    }
   }

  }


  return {
   min,
   minArr,
  }
 }

 window.calc = calc
})()

