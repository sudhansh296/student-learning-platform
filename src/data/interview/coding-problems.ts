export interface CodingProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  timeLimit: string;
  description: string;
  examples: Array<{ input: string; output: string }>;
  hints: string[];
  solution: string;
  explanation: string;
  tags: string[];
}

export const codingProblems: CodingProblem[] = [
  // ─── ARRAYS (1-20) ───
  {
    id: 1,
    title: 'Reverse a String',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '5 min',
    description: 'Write a function that reverses a string without using the built-in reverse() method.',
    examples: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"world"', output: '"dlrow"' },
    ],
    hints: [
      'Iterate from the last character to the first',
      'Try a two-pointer swap approach on a split array',
      'You can also use split + reverse + join',
    ],
    solution: `function reverseString(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) result += str[i];
  return result;
}
// One-liner
const rev = str => str.split('').reverse().join('');`,
    explanation: 'O(n) time and O(n) space. The loop version builds the result character by character from the end.',
    tags: ['strings', 'fundamentals'],
  },
  {
    id: 2,
    title: 'FizzBuzz',
    difficulty: 'Easy',
    topic: 'Logic',
    timeLimit: '5 min',
    description: 'Return an array of strings 1 to n. Multiples of 3 become "Fizz", multiples of 5 become "Buzz", multiples of both become "FizzBuzz".',
    examples: [
      { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' },
      { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    hints: [
      'Check % 15 (divisible by both) BEFORE checking % 3 or % 5',
      'Use the modulo operator % to check divisibility',
    ],
    solution: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push('Fizz');
    else if (i % 5 === 0) result.push('Buzz');
    else result.push(String(i));
  }
  return result;
}`,
    explanation: 'Check the combined condition (% 15) first to avoid incorrect branching. Order of conditions matters.',
    tags: ['logic', 'loops'],
  },
  {
    id: 3,
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Hash Maps',
    timeLimit: '10 min',
    description: 'Given an array of integers and a target sum, return the indices of the two numbers that add up to the target. Each input has exactly one solution.',
    examples: [
      { input: 'nums=[2,7,11,15], target=9', output: '[0,1]' },
      { input: 'nums=[3,2,4], target=6', output: '[1,2]' },
    ],
    hints: [
      'For each number, calculate complement = target - num',
      'A hash map can look up whether complement exists in O(1)',
      'Store each number with its index as you iterate',
    ],
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}`,
    explanation: 'Hash map approach: O(n) time and O(n) space. For each num, check if its complement is already stored, then store the current num.',
    tags: ['arrays', 'hash-map'],
  },
  {
    id: 4,
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    topic: 'Arrays',
    timeLimit: '5 min',
    description: 'Given an integer array, return true if any value appears at least twice. Return false if every element is distinct.',
    examples: [
      { input: '[1,2,3,1]', output: 'true' },
      { input: '[1,2,3,4]', output: 'false' },
    ],
    hints: [
      'A Set stores only unique values',
      'Compare the Set size to the array length',
    ],
    solution: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
// One-liner
const hasDuplicate = nums => new Set(nums).size !== nums.length;`,
    explanation: 'Set lookup is O(1), so overall O(n) time and O(n) space. The one-liner compares Set size to array length — if smaller, there were duplicates.',
    tags: ['arrays', 'hash-set'],
  },
  {
    id: 5,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topic: 'Arrays',
    timeLimit: '10 min',
    description: 'Given an array of prices where prices[i] is the price on day i, return the maximum profit from a single buy-then-sell transaction.',
    examples: [
      { input: '[7,1,5,3,6,4]', output: '5 (buy at 1, sell at 6)' },
      { input: '[7,6,4,3,1]', output: '0 (no profit possible)' },
    ],
    hints: [
      'Track the minimum price seen so far as you iterate',
      'At each day, check if selling today beats the current max profit',
    ],
    solution: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    if (price < minPrice) minPrice = price;
    else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
  }
  return maxProfit;
}`,
    explanation: 'O(n) single pass. Track the lowest buying price seen so far. At each price, compute potential profit and update maxProfit if better.',
    tags: ['arrays', 'greedy'],
  },
  {
    id: 6,
    title: 'Maximum Subarray (Kadane\'s)',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '15 min',
    description: 'Given an integer array, find the contiguous subarray with the largest sum and return its sum.',
    examples: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6 (subarray [4,-1,2,1])' },
      { input: '[5,4,-1,7,8]', output: '23' },
    ],
    hints: [
      'At each position, decide: extend the current subarray or start fresh?',
      'If currentSum + nums[i] < nums[i], discard the current subarray',
      'Track maxSum separately from currentSum',
    ],
    solution: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    explanation: 'Kadane\'s algorithm: greedy decision at each step — extend or restart. O(n) time, O(1) space.',
    tags: ['dynamic-programming', 'arrays', 'greedy'],
  },
  {
    id: 7,
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '20 min',
    description: 'Given an integer array, return an array where output[i] equals the product of all elements except nums[i]. Do not use division.',
    examples: [
      { input: '[1,2,3,4]', output: '[24,12,8,6]' },
      { input: '[-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    hints: [
      'Build a prefix product array (product of all elements to the left)',
      'Build a suffix product array (product of all elements to the right)',
      'Multiply prefix[i] * suffix[i] for the answer',
    ],
    solution: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  // Left pass: result[i] = product of all nums to the left
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  // Right pass: multiply by product of all nums to the right
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}`,
    explanation: 'Two passes: left products then right products. O(n) time, O(1) extra space (output array not counted).',
    tags: ['arrays', 'prefix-sum'],
  },
  {
    id: 8,
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '15 min',
    description: 'A sorted array was rotated at an unknown pivot. Find the minimum element. Must run in O(log n).',
    examples: [
      { input: '[3,4,5,1,2]', output: '1' },
      { input: '[4,5,6,7,0,1,2]', output: '0' },
    ],
    hints: [
      'Use binary search — compare mid with right to decide which half to search',
      'If nums[mid] > nums[right], the minimum is in the right half',
      'Otherwise the minimum is in the left half (including mid)',
    ],
    solution: `function findMin(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) left = mid + 1;
    else right = mid;
  }
  return nums[left];
}`,
    explanation: 'Modified binary search: if nums[mid] > nums[right], the pivot (and min) is in the right half. Otherwise search left including mid.',
    tags: ['arrays', 'binary-search'],
  },
  {
    id: 9,
    title: '3Sum',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '20 min',
    description: 'Given an integer array, return all unique triplets [nums[i], nums[j], nums[k]] such that i, j, k are distinct and nums[i] + nums[j] + nums[k] = 0.',
    examples: [
      { input: '[-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,1,1]', output: '[]' },
    ],
    hints: [
      'Sort the array first to enable two-pointer approach',
      'For each element i, use two pointers left and right to find pairs',
      'Skip duplicates to avoid repeating triplets',
    ],
    solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicates
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
    explanation: 'Sort + two pointers: fix one element, use two pointers for the other two. Skip duplicates at each level. O(n²) time.',
    tags: ['arrays', 'two-pointer', 'sorting'],
  },
  {
    id: 10,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    timeLimit: '15 min',
    description: 'Given an array height representing vertical lines, find two lines that together with the x-axis form a container that holds the most water.',
    examples: [
      { input: '[1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: '[1,1]', output: '1' },
    ],
    hints: [
      'Use two pointers starting at each end',
      'Water = min(height[left], height[right]) * (right - left)',
      'Move the pointer with the smaller height inward',
    ],
    solution: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const water = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, water);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
    explanation: 'Two-pointer greedy: always move the shorter side inward. Moving the taller side can never increase the water area. O(n) time.',
    tags: ['arrays', 'two-pointer', 'greedy'],
  },
  {
    id: 11,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'Arrays',
    timeLimit: '25 min',
    description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
    examples: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: '[4,2,0,3,2,5]', output: '9' },
    ],
    hints: [
      'Water at position i = min(maxLeft[i], maxRight[i]) - height[i]',
      'Precompute arrays of max height to the left and right',
      'Or use two pointers to do it in O(1) space',
    ],
    solution: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      height[left] >= leftMax ? (leftMax = height[left]) : (water += leftMax - height[left]);
      left++;
    } else {
      height[right] >= rightMax ? (rightMax = height[right]) : (water += rightMax - height[right]);
      right--;
    }
  }
  return water;
}`,
    explanation: 'Two-pointer approach: O(n) time, O(1) space. The limiting factor is the shorter side, so process the shorter side and accumulate water.',
    tags: ['arrays', 'two-pointer', 'stack'],
  },
  {
    id: 12,
    title: 'Move Zeroes',
    difficulty: 'Easy',
    topic: 'Arrays',
    timeLimit: '5 min',
    description: 'Given an integer array, move all 0s to the end while maintaining the relative order of the non-zero elements. Do it in-place.',
    examples: [
      { input: '[0,1,0,3,12]', output: '[1,3,12,0,0]' },
      { input: '[0]', output: '[0]' },
    ],
    hints: [
      'Use a slow pointer tracking where the next non-zero should go',
      'Iterate with a fast pointer and swap non-zeros to the slow pointer position',
    ],
    solution: `function moveZeroes(nums) {
  let insertPos = 0;
  for (const num of nums) {
    if (num !== 0) nums[insertPos++] = num;
  }
  while (insertPos < nums.length) nums[insertPos++] = 0;
  return nums;
}`,
    explanation: 'Two-pass in-place: first fill non-zeros in order, then fill the remainder with zeros. O(n) time, O(1) space.',
    tags: ['arrays', 'two-pointer'],
  },
  {
    id: 13,
    title: 'Missing Number',
    difficulty: 'Easy',
    topic: 'Arrays',
    timeLimit: '5 min',
    description: 'Given an array containing n distinct numbers in the range [0, n], find the one number missing from the range.',
    examples: [
      { input: '[3,0,1]', output: '2' },
      { input: '[0,1]', output: '2' },
    ],
    hints: [
      'Sum of 0..n is n*(n+1)/2',
      'Subtract the actual sum from expected sum',
      'XOR approach also works',
    ],
    solution: `function missingNumber(nums) {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;
  const actual = nums.reduce((a, b) => a + b, 0);
  return expected - actual;
}`,
    explanation: 'Gauss formula gives expected sum. Actual sum subtracted gives the missing number. O(n) time, O(1) space.',
    tags: ['arrays', 'math'],
  },
  {
    id: 14,
    title: 'Single Number',
    difficulty: 'Easy',
    topic: 'Arrays',
    timeLimit: '5 min',
    description: 'Given a non-empty array where every element appears twice except one, find that single one. Must be O(n) time and O(1) space.',
    examples: [
      { input: '[2,2,1]', output: '1' },
      { input: '[4,1,2,1,2]', output: '4' },
    ],
    hints: [
      'XOR of a number with itself is 0',
      'XOR of a number with 0 is the number itself',
      'XOR all elements — duplicates cancel out',
    ],
    solution: `function singleNumber(nums) {
  return nums.reduce((xor, num) => xor ^ num, 0);
}`,
    explanation: 'XOR is commutative and associative. Pairs cancel (n^n=0) and 0^n=n, so only the unique element remains. O(n) time, O(1) space.',
    tags: ['arrays', 'bit-manipulation'],
  },
  {
    id: 15,
    title: 'Merge Sorted Arrays',
    difficulty: 'Easy',
    topic: 'Arrays',
    timeLimit: '10 min',
    description: 'Given two sorted integer arrays, merge them into one sorted array without using sort().',
    examples: [
      { input: '[1,3,5] and [2,4,6]', output: '[1,2,3,4,5,6]' },
      { input: '[1,2,3] and []', output: '[1,2,3]' },
    ],
    hints: [
      'Use two pointers, one for each array',
      'Compare elements at each pointer, push the smaller one',
      'After one array is exhausted, append the rest of the other',
    ],
    solution: `function mergeSortedArrays(arr1, arr2) {
  const result = [];
  let i = 0, j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) result.push(arr1[i++]);
    else result.push(arr2[j++]);
  }
  while (i < arr1.length) result.push(arr1[i++]);
  while (j < arr2.length) result.push(arr2[j++]);
  return result;
}`,
    explanation: 'Two-pointer merge: compare front elements, take the smaller. O(n+m) time and space. This is also the merge step in merge sort.',
    tags: ['arrays', 'two-pointer', 'sorting'],
  },
  {
    id: 16,
    title: 'Find Duplicate Number',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '15 min',
    description: 'Given an array of n+1 integers where each integer is in [1, n], find the one duplicate number. Solve without modifying the array.',
    examples: [
      { input: '[1,3,4,2,2]', output: '2' },
      { input: '[3,1,3,4,2]', output: '3' },
    ],
    hints: [
      'Set approach: O(n) time, O(n) space',
      'Floyd\'s cycle detection: treat array values as pointers',
      'The duplicate creates a cycle in the implicit linked list',
    ],
    solution: `// Set approach - O(n) time, O(n) space
function findDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return num;
    seen.add(num);
  }
}
// Floyd's cycle - O(n) time, O(1) space
function findDuplicateOptimal(nums) {
  let slow = nums[0], fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}`,
    explanation: 'Set approach is most readable. Floyd\'s cycle detection achieves O(1) space by treating array values as pointers — the duplicate creates a cycle.',
    tags: ['arrays', 'hash-set', 'cycle-detection'],
  },
  {
    id: 17,
    title: 'Jump Game',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '15 min',
    description: 'Given an integer array where each element represents your maximum jump length at that position, determine if you can reach the last index starting from index 0.',
    examples: [
      { input: '[2,3,1,1,4]', output: 'true' },
      { input: '[3,2,1,0,4]', output: 'false' },
    ],
    hints: [
      'Track the furthest index you can reach',
      'If current index > furthest reachable, return false',
      'Greedy: update maxReach = max(maxReach, i + nums[i])',
    ],
    solution: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
    explanation: 'Greedy approach: track the furthest reachable index. If we ever find an index we can\'t reach, return false. O(n) time, O(1) space.',
    tags: ['arrays', 'greedy'],
  },
  {
    id: 18,
    title: 'Rotate Array',
    difficulty: 'Easy',
    topic: 'Arrays',
    timeLimit: '10 min',
    description: 'Given an integer array, rotate it to the right by k steps.',
    examples: [
      { input: '[1,2,3,4,5,6,7], k=3', output: '[5,6,7,1,2,3,4]' },
      { input: '[-1,-100,3,99], k=2', output: '[3,99,-1,-100]' },
    ],
    hints: [
      'k = k % n to handle k larger than array length',
      'Reverse the whole array, then reverse first k, then reverse last n-k',
      'Or use slice and concat',
    ],
    solution: `function rotate(nums, k) {
  k = k % nums.length;
  const reversed = [...nums].reverse();
  return [...reversed.slice(0, k).reverse(), ...reversed.slice(k).reverse()];
}
// In-place three-reverse
function rotateInPlace(nums, k) {
  k = k % nums.length;
  const rev = (arr, l, r) => { while (l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; } };
  rev(nums, 0, nums.length - 1);
  rev(nums, 0, k - 1);
  rev(nums, k, nums.length - 1);
}`,
    explanation: 'Three-reverse trick: reverse all, reverse [0,k-1], reverse [k,n-1]. O(n) time, O(1) space.',
    tags: ['arrays', 'two-pointer'],
  },
  {
    id: 19,
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '20 min',
    description: 'Given an integer array and an integer k, return the total number of subarrays whose sum equals k.',
    examples: [
      { input: '[1,1,1], k=2', output: '2' },
      { input: '[1,2,3], k=3', output: '2' },
    ],
    hints: [
      'Use prefix sums: prefixSum[i] - prefixSum[j] = k means subarray [j+1..i] sums to k',
      'Store prefix sum frequencies in a hash map',
      'At each step, check if (currentSum - k) exists in the map',
    ],
    solution: `function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let count = 0, sum = 0;
  for (const num of nums) {
    sum += num;
    count += (map.get(sum - k) || 0);
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}`,
    explanation: 'Prefix sum + hash map: O(n) time, O(n) space. Initialize map with {0:1} to handle subarrays starting at index 0.',
    tags: ['arrays', 'hash-map', 'prefix-sum'],
  },
  {
    id: 20,
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '20 min',
    description: 'Given an unsorted integer array, return the length of the longest consecutive elements sequence. Must run in O(n).',
    examples: [
      { input: '[100,4,200,1,3,2]', output: '4 (sequence: [1,2,3,4])' },
      { input: '[0,3,7,2,5,8,4,6,0,1]', output: '9' },
    ],
    hints: [
      'Put all numbers in a Set for O(1) lookup',
      'Only start counting from a number if num-1 is NOT in the set (it\'s a sequence start)',
      'Then count how many consecutive numbers follow',
    ],
    solution: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    if (!set.has(num - 1)) { // start of a sequence
      let curr = num, len = 1;
      while (set.has(curr + 1)) { curr++; len++; }
      maxLen = Math.max(maxLen, len);
    }
  }
  return maxLen;
}`,
    explanation: 'Set lookup enables O(n) total time. Only start sequences at their beginning (num-1 not in set) to avoid redundant work.',
    tags: ['arrays', 'hash-set'],
  },

  // ─── STRINGS (21-40) ───
  {
    id: 21,
    title: 'Check if Anagram',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Given two strings s and t, return true if t is an anagram of s (uses same characters, same frequency).',
    examples: [
      { input: 's="anagram", t="nagaram"', output: 'true' },
      { input: 's="rat", t="car"', output: 'false' },
    ],
    hints: [
      'If lengths differ, they cannot be anagrams',
      'Sort both strings and compare',
      'Or count character frequencies and compare',
    ],
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
    explanation: 'Frequency map approach: O(n) time. Count chars in s, decrement for t. Any missing or negative count means not an anagram.',
    tags: ['strings', 'hash-map'],
  },
  {
    id: 22,
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.',
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true' },
      { input: '"race a car"', output: 'false' },
    ],
    hints: [
      'Use two pointers from each end',
      'Skip non-alphanumeric characters',
      'Compare lowercase versions of valid chars',
    ],
    solution: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++; right--;
  }
  return true;
}`,
    explanation: 'Two-pointer approach: skip non-alphanumeric chars, compare lowercase. O(n) time, O(1) space.',
    tags: ['strings', 'two-pointer'],
  },
  {
    id: 23,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    timeLimit: '15 min',
    description: 'Given a string, find the length of the longest substring without repeating characters.',
    examples: [
      { input: '"abcabcbb"', output: '3 (substring "abc")' },
      { input: '"bbbbb"', output: '1' },
    ],
    hints: [
      'Use a sliding window with a Set to track current window chars',
      'Expand right; shrink left when a duplicate is found',
      'Track max window size seen',
    ],
    solution: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) { seen.delete(s[left]); left++; }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    explanation: 'Sliding window + Set: expand right, shrink left on duplicates. O(n) time, O(min(n,m)) space where m is charset size.',
    tags: ['strings', 'sliding-window', 'hash-set'],
  },
  {
    id: 24,
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    topic: 'Strings',
    timeLimit: '20 min',
    description: 'Given a string, return the longest palindromic substring.',
    examples: [
      { input: '"babad"', output: '"bab" or "aba"' },
      { input: '"cbbd"', output: '"bb"' },
    ],
    hints: [
      'Expand around each center (both odd and even length palindromes)',
      'For each index, expand outward as long as chars match',
      'Track the longest expansion found',
    ],
    solution: `function longestPalindrome(s) {
  let start = 0, maxLen = 1;
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd length
    expand(i, i + 1); // even length
  }
  return s.slice(start, start + maxLen);
}`,
    explanation: 'Expand-around-center: O(n²) time, O(1) space. Check both odd and even centers at each position.',
    tags: ['strings', 'dynamic-programming'],
  },
  {
    id: 25,
    title: 'Reverse Words in a String',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Given a string, reverse the order of the words. Words are separated by spaces. Remove leading/trailing spaces and reduce multiple spaces to single.',
    examples: [
      { input: '"the sky is blue"', output: '"blue is sky the"' },
      { input: '"  hello world  "', output: '"world hello"' },
    ],
    hints: [
      'Split by whitespace, filter empty strings, reverse, join',
      'trim() removes leading/trailing spaces',
    ],
    solution: `function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}`,
    explanation: 'Split on any whitespace (regex \\s+), reverse the array, join with single space. One line solution.',
    tags: ['strings', 'arrays'],
  },
  {
    id: 26,
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Write a function to find the longest common prefix string amongst an array of strings. Return "" if there is no common prefix.',
    examples: [
      { input: '["flower","flow","flight"]', output: '"fl"' },
      { input: '["dog","racecar","car"]', output: '""' },
    ],
    hints: [
      'Take the first string as the initial prefix',
      'Shrink it until every other string starts with it',
      'Or sort and compare only the first and last strings',
    ],
    solution: `function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (!prefix) return '';
  }
  return prefix;
}`,
    explanation: 'Iteratively shrink the prefix until all strings start with it. O(S) where S is total characters in all strings.',
    tags: ['strings'],
  },
  {
    id: 27,
    title: 'Count and Say',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '15 min',
    description: 'Generate the nth term of the count-and-say sequence. Each term describes the previous: "1211" means one 1, one 2, two 1s → "111221".',
    examples: [
      { input: 'n=1', output: '"1"' },
      { input: 'n=4', output: '"1211"' },
    ],
    hints: [
      'Start with "1" and iteratively build each term',
      'Scan the current term, count runs of the same digit',
      'Append count + digit to build the next term',
    ],
    solution: `function countAndSay(n) {
  let result = '1';
  for (let i = 1; i < n; i++) {
    let next = '';
    let j = 0;
    while (j < result.length) {
      let count = 1;
      while (j + count < result.length && result[j + count] === result[j]) count++;
      next += count + result[j];
      j += count;
    }
    result = next;
  }
  return result;
}`,
    explanation: 'Iterate n-1 times, each time scanning runs of identical digits. O(n * 2^n) worst case as string can double in length.',
    tags: ['strings', 'simulation'],
  },
  {
    id: 28,
    title: 'Roman to Integer',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Convert a Roman numeral string to an integer. Roman numerals use I=1, V=5, X=10, L=50, C=100, D=500, M=1000.',
    examples: [
      { input: '"III"', output: '3' },
      { input: '"MCMXCIV"', output: '1994' },
    ],
    hints: [
      'If a smaller value comes before a larger one, subtract it (IV=4, IX=9)',
      'Otherwise add the value',
      'Iterate left to right comparing current and next',
    ],
    solution: `function romanToInt(s) {
  const val = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const curr = val[s[i]], next = val[s[i + 1]];
    if (next && curr < next) result -= curr;
    else result += curr;
  }
  return result;
}`,
    explanation: 'Scan left-to-right: if current value < next value, subtract (subtractive notation). Otherwise add. O(n) time.',
    tags: ['strings', 'hash-map', 'math'],
  },
  {
    id: 29,
    title: 'String Compression',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Compress a string by replacing consecutive identical characters with the character and its count (e.g., "aabccc" → "a2bc3"). If compressed is not shorter, return original.',
    examples: [
      { input: '"aabcccdddd"', output: '"a2bc3d4"' },
      { input: '"abc"', output: '"abc" (not shorter)' },
    ],
    hints: [
      'Count consecutive runs of each character',
      'Append char + count (skip count of 1)',
      'Compare lengths at the end',
    ],
    solution: `function compress(s) {
  let result = '';
  let i = 0;
  while (i < s.length) {
    let count = 1;
    while (i + count < s.length && s[i + count] === s[i]) count++;
    result += s[i] + (count > 1 ? count : '');
    i += count;
  }
  return result.length < s.length ? result : s;
}`,
    explanation: 'Single pass counting runs. Append char followed by count (omit if 1). Return shorter of compressed or original.',
    tags: ['strings'],
  },
  {
    id: 30,
    title: 'First Unique Character',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Given a string, find the first non-repeating character and return its index. If none exists, return -1.',
    examples: [
      { input: '"leetcode"', output: '0 (l)' },
      { input: '"aabb"', output: '-1' },
    ],
    hints: [
      'Count frequency of each character',
      'Then scan left to right to find the first with frequency 1',
    ],
    solution: `function firstUniqChar(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) return i;
  }
  return -1;
}`,
    explanation: 'Two passes: first count all frequencies, then find first char with frequency 1. O(n) time, O(1) space (only 26 letters).',
    tags: ['strings', 'hash-map'],
  },
  {
    id: 31,
    title: 'Reverse Vowels',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Given a string, reverse only the vowels (a, e, i, o, u, case-insensitive) and return the result.',
    examples: [
      { input: '"hello"', output: '"holle"' },
      { input: '"leetcode"', output: '"leotcede"' },
    ],
    hints: [
      'Use two pointers, one from each end',
      'Move each pointer until it points to a vowel',
      'Swap the vowels, then move both pointers inward',
    ],
    solution: `function reverseVowels(s) {
  const vowels = new Set('aeiouAEIOU');
  const arr = s.split('');
  let left = 0, right = arr.length - 1;
  while (left < right) {
    while (left < right && !vowels.has(arr[left])) left++;
    while (left < right && !vowels.has(arr[right])) right--;
    if (left < right) { [arr[left], arr[right]] = [arr[right], arr[left]]; left++; right--; }
  }
  return arr.join('');
}`,
    explanation: 'Two-pointer swap: skip non-vowels, swap vowels. O(n) time, O(n) space for the char array.',
    tags: ['strings', 'two-pointer'],
  },
  {
    id: 32,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topic: 'Hash Maps',
    timeLimit: '15 min',
    description: 'Given an array of strings, group the anagrams together.',
    examples: [
      { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: '[""]', output: '[[""]]' },
    ],
    hints: [
      'Anagrams produce the same string when sorted',
      'Use sorted string as hash map key',
      'Return the values of the map',
    ],
    solution: `function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return Array.from(map.values());
}`,
    explanation: 'Sort each word to get a canonical key. All anagrams share the same key. O(n * k log k) where k is max word length.',
    tags: ['strings', 'hash-map', 'sorting'],
  },
  {
    id: 33,
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    topic: 'Sliding Window',
    timeLimit: '30 min',
    description: 'Given strings s and t, return the minimum window substring of s that contains all characters of t. Return "" if no such window exists.',
    examples: [
      { input: 's="ADOBECODEBANC", t="ABC"', output: '"BANC"' },
      { input: 's="a", t="a"', output: '"a"' },
    ],
    hints: [
      'Use sliding window with two pointers and frequency maps',
      'Track how many distinct chars from t are satisfied in the window',
      'Shrink left when all chars are satisfied to minimize window',
    ],
    solution: `function minWindow(s, t) {
  if (!t || !s) return '';
  const need = {}, have = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  const required = Object.keys(need).length;
  let formed = 0, left = 0, minLen = Infinity, minStart = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    have[c] = (have[c] || 0) + 1;
    if (need[c] && have[c] === need[c]) formed++;
    while (formed === required) {
      if (right - left + 1 < minLen) { minLen = right - left + 1; minStart = left; }
      have[s[left]]--;
      if (need[s[left]] && have[s[left]] < need[s[left]]) formed--;
      left++;
    }
  }
  return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen);
}`,
    explanation: 'Sliding window with frequency maps. Track "formed" count of satisfied characters. Shrink window when all required chars are present. O(|s| + |t|) time.',
    tags: ['strings', 'sliding-window', 'hash-map'],
  },
  {
    id: 34,
    title: 'Word Break',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '20 min',
    description: 'Given a string s and a dictionary of strings, return true if s can be segmented into a space-separated sequence of dictionary words.',
    examples: [
      { input: 's="leetcode", wordDict=["leet","code"]', output: 'true' },
      { input: 's="catsandog", wordDict=["cats","dog","sand","and","cat"]', output: 'false' },
    ],
    hints: [
      'dp[i] = true if s[0..i-1] can be segmented',
      'dp[i] = any dp[j] where dp[j]=true AND s[j..i-1] is in dict',
      'Use a Set for O(1) dictionary lookup',
    ],
    solution: `function wordBreak(s, wordDict) {
  const set = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}`,
    explanation: 'DP: dp[i] true means s[0..i-1] is segmentable. For each position, check all previous valid positions. O(n²) time with O(n) space.',
    tags: ['dynamic-programming', 'strings'],
  },
  {
    id: 35,
    title: 'Decode Ways',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '20 min',
    description: 'A string of digits can be decoded like A=1, B=2, ..., Z=26. Count the number of ways to decode the string.',
    examples: [
      { input: '"12"', output: '2 (AB or L)' },
      { input: '"226"', output: '3 (BZ, VF, BBF)' },
    ],
    hints: [
      'dp[i] = number of ways to decode s[0..i-1]',
      'If s[i-1] is not 0, dp[i] += dp[i-1]',
      'If s[i-2..i-1] forms a valid 2-digit number (10-26), dp[i] += dp[i-2]',
    ],
    solution: `function numDecodings(s) {
  if (!s || s[0] === '0') return 0;
  const dp = new Array(s.length + 1).fill(0);
  dp[0] = 1; dp[1] = 1;
  for (let i = 2; i <= s.length; i++) {
    const oneDigit = parseInt(s[i - 1]);
    const twoDigit = parseInt(s.slice(i - 2, i));
    if (oneDigit >= 1) dp[i] += dp[i - 1];
    if (twoDigit >= 10 && twoDigit <= 26) dp[i] += dp[i - 2];
  }
  return dp[s.length];
}`,
    explanation: 'DP: at each position decide if we decode one digit or two. Both must be valid (non-zero single, 10-26 double). O(n) time and space.',
    tags: ['dynamic-programming', 'strings'],
  },
  {
    id: 36,
    title: 'Backspace String Compare',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Given two strings s and t where # means backspace, return true if they are equal after processing.',
    examples: [
      { input: 's="ab#c", t="ad#c"', output: 'true (both become "ac")' },
      { input: 's="ab##", t="c#d#"', output: 'true (both become "")' },
    ],
    hints: [
      'Use a stack: push chars, pop on #',
      'Or process both strings the same way and compare',
      'Two-pointer approach processes from right to left without extra space',
    ],
    solution: `function backspaceCompare(s, t) {
  const process = str => {
    const stack = [];
    for (const c of str) { c === '#' ? stack.pop() : stack.push(c); }
    return stack.join('');
  };
  return process(s) === process(t);
}`,
    explanation: 'Process each string with a stack: push regular chars, pop on #. Compare resulting strings. O(n+m) time and space.',
    tags: ['strings', 'stack'],
  },
  {
    id: 37,
    title: 'Repeated Substring Pattern',
    difficulty: 'Easy',
    topic: 'Strings',
    timeLimit: '10 min',
    description: 'Given a string, check if it can be constructed by repeating a substring of itself.',
    examples: [
      { input: '"abab"', output: 'true ("ab" repeated)' },
      { input: '"aba"', output: 'false' },
    ],
    hints: [
      'If s is formed by repeating a substring, then s+s with first and last char removed still contains s',
      'Alternatively, try all possible substring lengths dividing n',
    ],
    solution: `function repeatedSubstringPattern(s) {
  return (s + s).slice(1, -1).includes(s);
}
// Explicit approach
function repeatedSubstringPatternAlt(s) {
  const n = s.length;
  for (let len = 1; len <= n / 2; len++) {
    if (n % len !== 0) continue;
    if (s.slice(0, len).repeat(n / len) === s) return true;
  }
  return false;
}`,
    explanation: 'Clever trick: (s+s) with ends trimmed contains s iff s is a rotation/repetition of a substring. O(n) time.',
    tags: ['strings'],
  },
  {
    id: 38,
    title: 'Ransom Note',
    difficulty: 'Easy',
    topic: 'Hash Maps',
    timeLimit: '5 min',
    description: 'Given two strings ransomNote and magazine, return true if ransomNote can be constructed using letters from magazine (each letter used at most once).',
    examples: [
      { input: 'ransomNote="a", magazine="b"', output: 'false' },
      { input: 'ransomNote="aa", magazine="aab"', output: 'true' },
    ],
    hints: [
      'Count letter frequencies in magazine',
      'Check if ransomNote has any letter with higher frequency than magazine',
    ],
    solution: `function canConstruct(ransomNote, magazine) {
  const count = {};
  for (const c of magazine) count[c] = (count[c] || 0) + 1;
  for (const c of ransomNote) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
    explanation: 'Count available letters from magazine, then consume them for ransomNote. O(n+m) time.',
    tags: ['strings', 'hash-map'],
  },
  {
    id: 39,
    title: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    timeLimit: '20 min',
    description: 'Given a string and an integer k, find the length of the longest substring containing the same letter after replacing at most k characters.',
    examples: [
      { input: 's="ABAB", k=2', output: '4 (replace both As or both Bs)' },
      { input: 's="AABABBA", k=1', output: '4' },
    ],
    hints: [
      'Sliding window: window is valid if (windowSize - maxFrequency) <= k',
      'Track max frequency of any char in current window',
      'Shrink left when condition is violated',
    ],
    solution: `function characterReplacement(s, k) {
  const count = {};
  let left = 0, maxFreq = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    count[s[right]] = (count[s[right]] || 0) + 1;
    maxFreq = Math.max(maxFreq, count[s[right]]);
    while ((right - left + 1) - maxFreq > k) { count[s[left]]--; left++; }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    explanation: 'Window is valid when windowSize - maxFreqChar <= k. If invalid, shrink from left. maxFreq only needs to increase (it can only get worse if we shrink). O(n) time.',
    tags: ['strings', 'sliding-window'],
  },
  {
    id: 40,
    title: 'Palindrome Partitioning Min Cuts',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '25 min',
    description: 'Given a string, return the minimum number of cuts needed so that every substring is a palindrome.',
    examples: [
      { input: '"aab"', output: '1 (cut between a and ab: ["aa","b"])' },
      { input: '"a"', output: '0' },
    ],
    hints: [
      'dp[i] = min cuts for s[0..i]',
      'If s[0..i] is already a palindrome, dp[i] = 0',
      'Otherwise dp[i] = min(dp[j-1] + 1) for all j where s[j..i] is a palindrome',
    ],
    solution: `function minCut(s) {
  const n = s.length;
  const isPalin = Array.from({length: n}, () => new Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      isPalin[i][j] = s[i] === s[j] && (j - i <= 2 || isPalin[i+1][j-1]);
    }
  }
  const dp = new Array(n).fill(0).map((_, i) => i);
  for (let i = 1; i < n; i++) {
    if (isPalin[0][i]) { dp[i] = 0; continue; }
    for (let j = 1; j <= i; j++) {
      if (isPalin[j][i]) dp[i] = Math.min(dp[i], dp[j-1] + 1);
    }
  }
  return dp[n - 1];
}`,
    explanation: 'Precompute all palindrome substrings with DP, then compute min cuts. O(n²) time and space.',
    tags: ['dynamic-programming', 'strings'],
  },

  // ─── HASH MAPS & SETS (41-50) ───
  {
    id: 41,
    title: 'Happy Number',
    difficulty: 'Easy',
    topic: 'Hash Maps',
    timeLimit: '10 min',
    description: 'Determine if n is a "happy number": repeatedly replace n with the sum of squares of its digits until it reaches 1 (happy) or cycles forever (not happy).',
    examples: [
      { input: 'n=19', output: 'true (1²+9²=82 → 8²+2²=68 → ... → 1)' },
      { input: 'n=2', output: 'false (enters a cycle)' },
    ],
    hints: [
      'Use a Set to detect cycles',
      'Or use slow/fast pointers (Floyd\'s cycle detection)',
      'Sum of digit squares: extract digits with % 10 and Math.floor',
    ],
    solution: `function isHappy(n) {
  const sumOfSquares = num => {
    let sum = 0;
    while (num > 0) { const d = num % 10; sum += d * d; num = Math.floor(num / 10); }
    return sum;
  };
  const seen = new Set();
  while (n !== 1) {
    if (seen.has(n)) return false;
    seen.add(n);
    n = sumOfSquares(n);
  }
  return true;
}`,
    explanation: 'Compute sum of digit squares repeatedly. Use a Set to detect if we enter a cycle (unhappy). O(log n) per iteration.',
    tags: ['hash-map', 'math'],
  },
  {
    id: 42,
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    topic: 'Hash Maps',
    timeLimit: '10 min',
    description: 'Given two strings s and t, determine if they are isomorphic — characters in s can be replaced to get t, preserving order without two chars mapping to the same char.',
    examples: [
      { input: 's="egg", t="add"', output: 'true (e→a, g→d)' },
      { input: 's="foo", t="bar"', output: 'false (o maps to both a and r)' },
    ],
    hints: [
      'Use two maps: s→t and t→s',
      'For each pair (s[i], t[i]), check consistency in both directions',
    ],
    solution: `function isIsomorphic(s, t) {
  const sToT = {}, tToS = {};
  for (let i = 0; i < s.length; i++) {
    const sc = s[i], tc = t[i];
    if (sToT[sc] && sToT[sc] !== tc) return false;
    if (tToS[tc] && tToS[tc] !== sc) return false;
    sToT[sc] = tc;
    tToS[tc] = sc;
  }
  return true;
}`,
    explanation: 'Two maps enforce bijection: each s-char maps to one t-char and vice versa. O(n) time and space.',
    tags: ['strings', 'hash-map'],
  },
  {
    id: 43,
    title: 'Word Pattern',
    difficulty: 'Easy',
    topic: 'Hash Maps',
    timeLimit: '10 min',
    description: 'Given a pattern string and a string s, return true if s follows the same pattern (bijective mapping between pattern letters and words).',
    examples: [
      { input: 'pattern="abba", s="dog cat cat dog"', output: 'true' },
      { input: 'pattern="abba", s="dog cat cat fish"', output: 'false' },
    ],
    hints: [
      'Split s into words',
      'Use two maps: pattern char → word and word → pattern char',
      'Check both mappings are consistent',
    ],
    solution: `function wordPattern(pattern, s) {
  const words = s.split(' ');
  if (pattern.length !== words.length) return false;
  const charToWord = {}, wordToChar = {};
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i], w = words[i];
    if (charToWord[c] && charToWord[c] !== w) return false;
    if (wordToChar[w] && wordToChar[w] !== c) return false;
    charToWord[c] = w; wordToChar[w] = c;
  }
  return true;
}`,
    explanation: 'Bijective mapping check: same as isomorphic strings but with words. O(n) time.',
    tags: ['strings', 'hash-map'],
  },
  {
    id: 44,
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    topic: 'Hash Maps',
    timeLimit: '15 min',
    description: 'Given an integer array and k, return the k most frequent elements.',
    examples: [
      { input: '[1,1,1,2,2,3], k=2', output: '[1,2]' },
      { input: '[1], k=1', output: '[1]' },
    ],
    hints: [
      'Count frequencies with a hash map',
      'Sort by frequency descending, take top k',
      'Bucket sort by frequency for O(n) solution',
    ],
    solution: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  // Bucket sort by frequency
  const buckets = new Array(nums.length + 1).fill(null).map(() => []);
  for (const [num, count] of freq) buckets[count].push(num);
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }
  return result.slice(0, k);
}`,
    explanation: 'Bucket sort by frequency: buckets[count] holds all numbers with that frequency. Scan from highest bucket down. O(n) time.',
    tags: ['arrays', 'hash-map', 'bucket-sort'],
  },
  {
    id: 45,
    title: 'Find All Anagrams in String',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    timeLimit: '20 min',
    description: 'Given strings s and p, return all start indices of p\'s anagrams in s.',
    examples: [
      { input: 's="cbaebabacd", p="abc"', output: '[0,6]' },
      { input: 's="abab", p="ab"', output: '[0,1,2]' },
    ],
    hints: [
      'Use fixed-size sliding window of length p.length',
      'Compare character frequency maps of window and p',
      'Optimize with a "matches" counter instead of full comparison',
    ],
    solution: `function findAnagrams(s, p) {
  const result = [];
  const need = {}, have = {};
  for (const c of p) need[c] = (need[c] || 0) + 1;
  let formed = 0, required = Object.keys(need).length;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    have[c] = (have[c] || 0) + 1;
    if (need[c] && have[c] === need[c]) formed++;
    if (right - left + 1 === p.length) {
      if (formed === required) result.push(left);
      const lc = s[left];
      if (need[lc] && have[lc] === need[lc]) formed--;
      have[lc]--;
      left++;
    }
  }
  return result;
}`,
    explanation: 'Fixed-size sliding window: maintain frequency counts. When window size equals p.length, check if all chars satisfied. O(n) time.',
    tags: ['strings', 'sliding-window', 'hash-map'],
  },
  {
    id: 46,
    title: 'LRU Cache',
    difficulty: 'Hard',
    topic: 'Design Patterns',
    timeLimit: '30 min',
    description: 'Implement an LRU (Least Recently Used) Cache with O(1) get(key) and put(key, value) operations. When capacity is exceeded, evict the least recently used item.',
    examples: [
      { input: 'capacity=2; put(1,1); put(2,2); get(1)→1; put(3,3); get(2)→-1', output: '-1 (2 was evicted)' },
      { input: 'put(1,1); put(2,2); put(1,10); get(2)→2; get(1)→10', output: 'Both accessible' },
    ],
    hints: [
      'Use a Map (maintains insertion order) for O(1) get/set',
      'On get: delete and re-insert to move to end (most recent)',
      'On put: if over capacity, delete the first key (least recent)',
    ],
    solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // maintains insertion order
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // move to end (most recent)
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value); // delete LRU
    }
  }
}`,
    explanation: 'JavaScript Map preserves insertion order. Delete+re-insert moves to "most recent" end. First key is always the LRU. O(1) for all operations.',
    tags: ['design-patterns', 'hash-map', 'linked-list'],
  },
  {
    id: 47,
    title: 'Subarray with Zero Sum',
    difficulty: 'Medium',
    topic: 'Hash Maps',
    timeLimit: '15 min',
    description: 'Given an integer array, check if there exists a subarray (of length >= 1) with a sum of zero.',
    examples: [
      { input: '[4,2,-2,-4,0,1]', output: 'true ([2,-2] or [4,2,-2,-4] etc.)' },
      { input: '[1,2,3]', output: 'false' },
    ],
    hints: [
      'Use prefix sums: if two prefix sums are equal, the subarray between them sums to 0',
      'Also if prefix sum is 0 at any point, subarray from start sums to 0',
      'Store seen prefix sums in a Set',
    ],
    solution: `function hasZeroSumSubarray(nums) {
  const seen = new Set([0]);
  let sum = 0;
  for (const num of nums) {
    sum += num;
    if (seen.has(sum)) return true;
    seen.add(sum);
  }
  return false;
}`,
    explanation: 'Prefix sum with Set: if we see the same prefix sum twice (or a prefix sum of 0), a zero-sum subarray exists. O(n) time.',
    tags: ['arrays', 'hash-map', 'prefix-sum'],
  },
  {
    id: 48,
    title: 'Longest Substring with K Distinct Characters',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    timeLimit: '20 min',
    description: 'Given a string and integer k, return the length of the longest substring with at most k distinct characters.',
    examples: [
      { input: '"eceba", k=2', output: '3 ("ece")' },
      { input: '"aa", k=1', output: '2' },
    ],
    hints: [
      'Sliding window: expand right, shrink left when distinct count > k',
      'Use a map to track frequency of each char in the window',
      'Remove from map when frequency drops to 0',
    ],
    solution: `function lengthOfLongestSubstringKDistinct(s, k) {
  if (k === 0) return 0;
  const freq = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) || 0) + 1);
    while (freq.size > k) {
      freq.set(s[left], freq.get(s[left]) - 1);
      if (freq.get(s[left]) === 0) freq.delete(s[left]);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    explanation: 'Sliding window: maintain a frequency map. Shrink window when distinct count exceeds k. O(n) time.',
    tags: ['strings', 'sliding-window', 'hash-map'],
  },
  {
    id: 49,
    title: 'Four Sum',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '25 min',
    description: 'Given an array and target, return all unique quadruplets [a,b,c,d] such that a+b+c+d = target.',
    examples: [
      { input: '[1,0,-1,0,-2,2], target=0', output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]' },
      { input: '[2,2,2,2,2], target=8', output: '[[2,2,2,2]]' },
    ],
    hints: [
      'Sort the array first',
      'Fix two elements with outer loops, use two pointers for the inner two',
      'Skip duplicates at each level',
    ],
    solution: `function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < nums.length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let left = j + 1, right = nums.length - 1;
      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right];
        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]]);
          while (left < right && nums[left] === nums[left + 1]) left++;
          while (left < right && nums[right] === nums[right - 1]) right--;
          left++; right--;
        } else if (sum < target) left++;
        else right--;
      }
    }
  }
  return result;
}`,
    explanation: 'Generalization of 3Sum: fix two elements, use two pointers for the rest. Skip duplicates. O(n³) time.',
    tags: ['arrays', 'two-pointer', 'sorting'],
  },
  {
    id: 50,
    title: 'Intersection of Two Arrays',
    difficulty: 'Easy',
    topic: 'Hash Maps',
    timeLimit: '10 min',
    description: 'Given two arrays, return an array of their intersection (unique elements that appear in both).',
    examples: [
      { input: '[1,2,2,1] and [2,2]', output: '[2]' },
      { input: '[4,9,5] and [9,4,9,8,4]', output: '[9,4]' },
    ],
    hints: [
      'Use a Set for one array, then check each element of the other',
      'Result should contain unique values only',
    ],
    solution: `function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  return [...new Set(nums2.filter(n => set1.has(n)))];
}`,
    explanation: 'Convert one array to Set for O(1) lookup. Filter the other array and wrap in Set to deduplicate. O(n+m) time.',
    tags: ['arrays', 'hash-set'],
  },

  // ─── STACKS & QUEUES (51-60) ───
  {
    id: 51,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stacks',
    timeLimit: '10 min',
    description: 'Given a string containing only \'(\', \')\', \'{\', \'}\', \'[\', \']\', determine if the input string is valid (all brackets closed correctly and in order).',
    examples: [
      { input: '"()[]{}"', output: 'true' },
      { input: '"(]"', output: 'false' },
    ],
    hints: [
      'Use a stack: push opening brackets, pop on closing',
      'A closing bracket must match the top of the stack',
      'Stack must be empty at the end',
    ],
    solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if ('({['.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}`,
    explanation: 'Push opening brackets. For closing brackets, check top of stack matches. Empty stack at end means all matched. O(n) time.',
    tags: ['stack', 'strings'],
  },
  {
    id: 52,
    title: 'Min Stack',
    difficulty: 'Easy',
    topic: 'Stacks',
    timeLimit: '15 min',
    description: 'Design a stack that supports push, pop, top, and getMin in O(1) time.',
    examples: [
      { input: 'push(5),push(3),push(7),getMin()→3,pop(),getMin()→3', output: 'getMin always O(1)' },
      { input: 'push(2),push(0),push(3),push(0),getMin()→0', output: '0' },
    ],
    hints: [
      'Maintain a separate "min stack" alongside the main stack',
      'The min stack tracks the minimum at each depth',
      'Push to minStack when new value <= current min; pop in sync',
    ],
    solution: `class MinStack {
  constructor() { this.stack = []; this.minStack = []; }
  push(val) {
    this.stack.push(val);
    if (!this.minStack.length || val <= this.minStack.at(-1)) this.minStack.push(val);
  }
  pop() {
    const val = this.stack.pop();
    if (val === this.minStack.at(-1)) this.minStack.pop();
  }
  top() { return this.stack.at(-1); }
  getMin() { return this.minStack.at(-1); }
}`,
    explanation: 'Parallel min stack: push to minStack when val is new minimum. Pop from minStack when the popped val equals current min. Both stacks stay in sync.',
    tags: ['stack', 'design'],
  },
  {
    id: 53,
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    topic: 'Stacks',
    timeLimit: '15 min',
    description: 'Evaluate an arithmetic expression in Reverse Polish Notation (postfix). Valid operators are +, -, *, /. Division truncates toward zero.',
    examples: [
      { input: '["2","1","+","3","*"]', output: '9 ((2+1)*3)' },
      { input: '["4","13","5","/","+"]', output: '6 (4 + 13/5 = 4+2)' },
    ],
    hints: [
      'Use a stack: push numbers, apply operators to top two elements',
      'Pop two values when you see an operator, push the result back',
      'Use Math.trunc for division to truncate toward zero',
    ],
    solution: `function evalRPN(tokens) {
  const stack = [];
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
  };
  for (const token of tokens) {
    if (ops[token]) {
      const b = stack.pop(), a = stack.pop();
      stack.push(ops[token](a, b));
    } else stack.push(Number(token));
  }
  return stack[0];
}`,
    explanation: 'Stack-based evaluation: numbers go in, operators pop two and push result. Note argument order (a then b) for subtraction and division.',
    tags: ['stack', 'math'],
  },
  {
    id: 54,
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    topic: 'Stacks',
    timeLimit: '15 min',
    description: 'Given daily temperatures, return an array where answer[i] is the number of days to wait for a warmer temperature. If no warmer day, put 0.',
    examples: [
      { input: '[73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
      { input: '[30,40,50,60]', output: '[1,1,1,0]' },
    ],
    hints: [
      'Use a monotonic stack storing indices of unresolved temperatures',
      'When a warmer temperature is found, resolve all cooler days on the stack',
    ],
    solution: `function dailyTemperatures(temperatures) {
  const result = new Array(temperatures.length).fill(0);
  const stack = []; // indices
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack.at(-1)]) {
      const idx = stack.pop();
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}`,
    explanation: 'Monotonic decreasing stack of indices. When we find a warmer day, pop and compute the wait. Remaining stack indices get 0 (default). O(n) time.',
    tags: ['stack', 'arrays'],
  },
  {
    id: 55,
    title: 'Decode String',
    difficulty: 'Medium',
    topic: 'Stacks',
    timeLimit: '20 min',
    description: 'Decode an encoded string where k[encodedString] means repeat encodedString k times. e.g., "3[a2[bc]]" → "abcbcabcbcabcbc".',
    examples: [
      { input: '"3[a]2[bc]"', output: '"aaabcbc"' },
      { input: '"3[a2[bc]]"', output: '"abcbcabcbcabcbc"' },
    ],
    hints: [
      'Use a stack to handle nested brackets',
      'Push current string and count when you see [, pop and repeat when you see ]',
    ],
    solution: `function decodeString(s) {
  const countStack = [], strStack = [];
  let current = '', num = 0;
  for (const c of s) {
    if (/\d/.test(c)) {
      num = num * 10 + Number(c);
    } else if (c === '[') {
      countStack.push(num); strStack.push(current);
      num = 0; current = '';
    } else if (c === ']') {
      const repeat = countStack.pop();
      current = strStack.pop() + current.repeat(repeat);
    } else current += c;
  }
  return current;
}`,
    explanation: 'Two stacks (for counts and partial strings). On [: save current state and reset. On ]: pop and repeat. O(n * max_repeat) time.',
    tags: ['stack', 'strings'],
  },
  {
    id: 56,
    title: 'Next Greater Element',
    difficulty: 'Easy',
    topic: 'Stacks',
    timeLimit: '15 min',
    description: 'Given an array, return an array where result[i] is the next greater element to the right of nums[i]. Use -1 if none exists.',
    examples: [
      { input: '[4,1,2]', output: '[-1,2,-1]' },
      { input: '[1,3,4,2]', output: '[3,4,-1,-1]' },
    ],
    hints: [
      'Use a monotonic stack (decreasing)',
      'When you find an element greater than stack top, that element is the answer for the stack top',
    ],
    solution: `function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack.at(-1)]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
    explanation: 'Monotonic stack: maintain indices of elements without a greater element found yet. When a larger element appears, resolve the stack. O(n) time.',
    tags: ['stack', 'arrays'],
  },
  {
    id: 57,
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    topic: 'Stacks',
    timeLimit: '30 min',
    description: 'Given an array of bar heights in a histogram, find the area of the largest rectangle.',
    examples: [
      { input: '[2,1,5,6,2,3]', output: '10 (bars 5 and 6)' },
      { input: '[2,4]', output: '4' },
    ],
    hints: [
      'Use a monotonic increasing stack of indices',
      'When a shorter bar is found, calculate rectangles for all taller bars on stack',
      'Width extends from previous stack top to current index',
    ],
    solution: `function largestRectangleArea(heights) {
  const stack = [-1];
  let maxArea = 0;
  heights.push(0); // sentinel
  for (let i = 0; i < heights.length; i++) {
    while (stack.at(-1) !== -1 && heights[i] < heights[stack.at(-1)]) {
      const h = heights[stack.pop()];
      const w = i - stack.at(-1) - 1;
      maxArea = Math.max(maxArea, h * w);
    }
    stack.push(i);
  }
  return maxArea;
}`,
    explanation: 'Monotonic stack: when a bar shorter than stack top is found, pop and compute area with that height extending between previous stack element and current index. O(n) time.',
    tags: ['stack', 'arrays'],
  },
  {
    id: 58,
    title: 'Implement Queue using Two Stacks',
    difficulty: 'Easy',
    topic: 'Stacks',
    timeLimit: '15 min',
    description: 'Implement a queue (FIFO) using only two stacks. Support push, pop, peek, and empty operations.',
    examples: [
      { input: 'push(1),push(2),peek()→1,pop()→1,empty()→false', output: 'FIFO order maintained' },
      { input: 'push(3),push(4),pop()→3,pop()→4', output: '3 then 4' },
    ],
    hints: [
      'Stack1 for pushing, Stack2 for popping/peeking',
      'Transfer all of Stack1 to Stack2 when Stack2 is empty (amortized O(1))',
    ],
    solution: `class MyQueue {
  constructor() { this.inbox = []; this.outbox = []; }
  push(x) { this.inbox.push(x); }
  transfer() { if (!this.outbox.length) while (this.inbox.length) this.outbox.push(this.inbox.pop()); }
  pop() { this.transfer(); return this.outbox.pop(); }
  peek() { this.transfer(); return this.outbox.at(-1); }
  empty() { return !this.inbox.length && !this.outbox.length; }
}`,
    explanation: 'Two stacks: inbox for push, outbox for pop/peek. Transfer inbox→outbox (reversing order) only when outbox is empty. Amortized O(1) per operation.',
    tags: ['stack', 'queue', 'design'],
  },
  {
    id: 59,
    title: 'Score of Parentheses',
    difficulty: 'Medium',
    topic: 'Stacks',
    timeLimit: '20 min',
    description: 'Given a balanced parentheses string, compute its score: "()" scores 1, "AB" scores A+B, "(A)" scores 2*A.',
    examples: [
      { input: '"()"', output: '1' },
      { input: '"(())"', output: '2' },
      { input: '"(()(()))"', output: '6' },
    ],
    hints: [
      'Use a stack initialized with [0]',
      'On (: push 0 (new frame)',
      'On ): pop v, add max(2*v, 1) to the new top',
    ],
    solution: `function scoreOfParentheses(s) {
  const stack = [0];
  for (const c of s) {
    if (c === '(') stack.push(0);
    else {
      const v = stack.pop();
      stack[stack.length - 1] += Math.max(2 * v, 1);
    }
  }
  return stack[0];
}`,
    explanation: 'Stack of running scores per depth level. () (v=0) contributes 1, (A) contributes 2*A. O(n) time.',
    tags: ['stack', 'strings', 'math'],
  },
  {
    id: 60,
    title: 'Remove Duplicate Letters',
    difficulty: 'Medium',
    topic: 'Stacks',
    timeLimit: '25 min',
    description: 'Given a string, remove duplicate letters so that every letter appears once and only once. Return the result in the smallest lexicographic order.',
    examples: [
      { input: '"bcabc"', output: '"abc"' },
      { input: '"cbacdcbc"', output: '"acdb"' },
    ],
    hints: [
      'Use a monotonic stack (greedy)',
      'Keep a count of remaining occurrences and a "seen" set',
      'Pop the stack if current char is smaller and the top char appears later',
    ],
    solution: `function removeDuplicateLetters(s) {
  const count = {};
  const inStack = new Set();
  const stack = [];
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of s) {
    count[c]--;
    if (inStack.has(c)) continue;
    while (stack.length && c < stack.at(-1) && count[stack.at(-1)] > 0) {
      inStack.delete(stack.pop());
    }
    stack.push(c);
    inStack.add(c);
  }
  return stack.join('');
}`,
    explanation: 'Greedy with monotonic stack: pop larger chars only if they appear later (count > 0). Result is smallest possible lexicographic order. O(n) time.',
    tags: ['stack', 'greedy', 'strings'],
  },

  // ─── LINKED LISTS (61-68) ───
  {
    id: 61,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    timeLimit: '10 min',
    description: 'Reverse a linked list (simulated as an array). Given [1,2,3,4,5], return [5,4,3,2,1].',
    examples: [
      { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: '[1,2]', output: '[2,1]' },
    ],
    hints: [
      'In a real linked list, use three pointers: prev, curr, next',
      'For the array simulation, simply reverse it',
    ],
    solution: `// Array simulation
function reverseList(list) {
  let left = 0, right = list.length - 1;
  while (left < right) {
    [list[left], list[right]] = [list[right], list[left]];
    left++; right--;
  }
  return list;
}
// Real linked list (for reference)
function reverseListLL(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    explanation: 'Two-pointer swap in-place: O(n) time, O(1) space. For real linked lists, reverse the next pointers iteratively.',
    tags: ['linked-list', 'two-pointer'],
  },
  {
    id: 62,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    timeLimit: '10 min',
    description: 'Merge two sorted arrays (simulating linked lists) into one sorted array.',
    examples: [
      { input: '[1,2,4] and [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: '[] and [0]', output: '[0]' },
    ],
    hints: [
      'Two pointers: compare front elements',
      'Take the smaller, advance that pointer',
      'Append remaining elements',
    ],
    solution: `function mergeTwoLists(list1, list2) {
  const result = [];
  let i = 0, j = 0;
  while (i < list1.length && j < list2.length) {
    if (list1[i] <= list2[j]) result.push(list1[i++]);
    else result.push(list2[j++]);
  }
  while (i < list1.length) result.push(list1[i++]);
  while (j < list2.length) result.push(list2[j++]);
  return result;
}`,
    explanation: 'Two-pointer merge: O(n+m) time. Compare and take the smaller element, then append the remaining tail.',
    tags: ['linked-list', 'two-pointer', 'sorting'],
  },
  {
    id: 63,
    title: 'Linked List Cycle Detection',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    timeLimit: '15 min',
    description: 'Detect a cycle in a sequence (simulated with an array of next-indices). Use Floyd\'s tortoise and hare algorithm concept.',
    examples: [
      { input: 'next=[1,2,0] (0→1→2→0 cycle)', output: 'true' },
      { input: 'next=[1,2,3,-1] (no cycle)', output: 'false' },
    ],
    hints: [
      'Slow pointer moves one step, fast pointer moves two steps',
      'If they meet, there is a cycle',
      'If fast reaches null/end, no cycle',
    ],
    solution: `// Simulate with Set (for interview concept)
function hasCycle(next) {
  const visited = new Set();
  let curr = 0;
  while (curr !== -1 && curr < next.length) {
    if (visited.has(curr)) return true;
    visited.add(curr);
    curr = next[curr];
  }
  return false;
}
// Floyd's algorithm concept
function hasCycleFloyd(next) {
  let slow = 0, fast = 0;
  while (fast !== -1 && next[fast] !== -1) {
    slow = next[slow];
    fast = next[next[fast]];
    if (slow === fast) return true;
  }
  return false;
}`,
    explanation: 'Floyd\'s cycle detection: fast pointer moves 2x. If there\'s a cycle, fast catches slow. O(n) time, O(1) space.',
    tags: ['linked-list', 'cycle-detection', 'two-pointer'],
  },
  {
    id: 64,
    title: 'Find Middle of Linked List',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    timeLimit: '10 min',
    description: 'Find the middle element of an array (simulating a linked list). For even length, return the second middle.',
    examples: [
      { input: '[1,2,3,4,5]', output: '3 (index 2)' },
      { input: '[1,2,3,4,5,6]', output: '4 (index 3, second middle)' },
    ],
    hints: [
      'Slow/fast pointer: slow moves 1, fast moves 2',
      'When fast reaches end, slow is at middle',
    ],
    solution: `function findMiddle(list) {
  let slow = 0, fast = 0;
  while (fast < list.length - 1 && fast + 1 < list.length - 1) {
    slow++;
    fast += 2;
  }
  return list[slow + (list.length % 2 === 0 ? 1 : 0)];
}
// Simpler approach
function findMiddleSimple(list) {
  return list[Math.floor(list.length / 2)];
}`,
    explanation: 'Fast/slow pointer naturally reaches the middle. For arrays, Math.floor(n/2) gives the second middle for even length.',
    tags: ['linked-list', 'two-pointer'],
  },
  {
    id: 65,
    title: 'Remove Nth from End',
    difficulty: 'Medium',
    topic: 'Linked Lists',
    timeLimit: '15 min',
    description: 'Given an array (simulating linked list) and integer n, remove the nth element from the end and return the result.',
    examples: [
      { input: '[1,2,3,4,5], n=2', output: '[1,2,3,5]' },
      { input: '[1], n=1', output: '[]' },
    ],
    hints: [
      'Two pointers: advance fast by n steps first',
      'Then move both until fast reaches end',
      'Slow will be just before the target',
    ],
    solution: `function removeNthFromEnd(list, n) {
  const copy = [...list];
  const targetIdx = copy.length - n;
  copy.splice(targetIdx, 1);
  return copy;
}
// Two-pointer approach (for real linked list concept)
function removeNthTwoPointer(list, n) {
  const dummy = [0, ...list];
  let fast = n + 1, slow = 0;
  while (fast < dummy.length) { fast++; slow++; }
  dummy.splice(slow + 1, 1);
  return dummy.slice(1);
}`,
    explanation: 'Two-pointer: fast starts n ahead. When fast reaches end, slow is at the node before target. O(n) single pass.',
    tags: ['linked-list', 'two-pointer'],
  },
  {
    id: 66,
    title: 'Palindrome Linked List',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    timeLimit: '10 min',
    description: 'Given an array representing a linked list, check if it reads the same forward and backward.',
    examples: [
      { input: '[1,2,2,1]', output: 'true' },
      { input: '[1,2]', output: 'false' },
    ],
    hints: [
      'Find the middle, reverse the second half, compare with first half',
      'Or simply use two pointers from each end',
    ],
    solution: `function isPalindrome(head) {
  let left = 0, right = head.length - 1;
  while (left < right) {
    if (head[left] !== head[right]) return false;
    left++; right--;
  }
  return true;
}`,
    explanation: 'Two-pointer comparison from both ends. O(n) time, O(1) space for the check.',
    tags: ['linked-list', 'two-pointer'],
  },
  {
    id: 67,
    title: 'Reorder List',
    difficulty: 'Medium',
    topic: 'Linked Lists',
    timeLimit: '20 min',
    description: 'Reorder an array from L0→L1→...→Ln to L0→Ln→L1→Ln-1→L2→Ln-2→...',
    examples: [
      { input: '[1,2,3,4]', output: '[1,4,2,3]' },
      { input: '[1,2,3,4,5]', output: '[1,5,2,4,3]' },
    ],
    hints: [
      'Find middle, reverse second half, merge the two halves',
      'Or use a deque/two-pointer approach',
    ],
    solution: `function reorderList(list) {
  const result = [];
  let left = 0, right = list.length - 1;
  while (left <= right) {
    result.push(list[left++]);
    if (left <= right) result.push(list[right--]);
  }
  return result;
}`,
    explanation: 'Two-pointer from both ends, alternately take from left and right. O(n) time, O(n) space for result.',
    tags: ['linked-list', 'two-pointer'],
  },
  {
    id: 68,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    topic: 'Arrays',
    timeLimit: '20 min',
    description: 'Two non-negative integers are represented as reversed digit arrays. Return their sum as a reversed digit array.',
    examples: [
      { input: '[2,4,3] and [5,6,4]', output: '[7,0,8] (342+465=807)' },
      { input: '[0] and [0]', output: '[0]' },
    ],
    hints: [
      'Iterate both arrays simultaneously, tracking carry',
      'For each position: sum = a + b + carry',
      'Digit = sum % 10, carry = Math.floor(sum / 10)',
    ],
    solution: `function addTwoNumbers(l1, l2) {
  const result = [];
  let carry = 0, i = 0, j = 0;
  while (i < l1.length || j < l2.length || carry) {
    const sum = (l1[i] || 0) + (l2[j] || 0) + carry;
    result.push(sum % 10);
    carry = Math.floor(sum / 10);
    i++; j++;
  }
  return result;
}`,
    explanation: 'Simulate digit-by-digit addition with carry. Arrays are already reversed so index 0 is the least significant digit. O(max(n,m)) time.',
    tags: ['arrays', 'math'],
  },

  // ─── TREES & RECURSION (69-78) ───
  {
    id: 69,
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    timeLimit: '10 min',
    description: 'Given a binary tree as a level-order array (null for missing nodes), return its maximum depth.',
    examples: [
      { input: '[3,9,20,null,null,15,7]', output: '3' },
      { input: '[1,null,2]', output: '2' },
    ],
    hints: [
      'Count non-null levels in the level-order array',
      'Or count ceil(log2(lastNonNullIndex + 1))',
    ],
    solution: `function maxDepth(tree) {
  // Find last non-null index
  let lastIdx = -1;
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i] !== null) { lastIdx = i; break; }
  }
  if (lastIdx === -1) return 0;
  return Math.floor(Math.log2(lastIdx + 1)) + 1;
}
// Recursive version (with node objects)
function maxDepthRecursive(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepthRecursive(root.left), maxDepthRecursive(root.right));
}`,
    explanation: 'For level-order array: last non-null index determines depth. In recursive version, depth = 1 + max(leftDepth, rightDepth).',
    tags: ['trees', 'recursion', 'bfs'],
  },
  {
    id: 70,
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    timeLimit: '10 min',
    description: 'Invert a binary tree (mirror it). Given level-order array, swap left and right children at each level.',
    examples: [
      { input: '[4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
      { input: '[2,1,3]', output: '[2,3,1]' },
    ],
    hints: [
      'For each node, swap its left and right children',
      'Do this recursively or with BFS',
    ],
    solution: `function invertTree(tree) {
  const result = [...tree];
  function invert(i) {
    if (i >= result.length || result[i] === null) return;
    const left = 2 * i + 1, right = 2 * i + 2;
    [result[left], result[right]] = [result[right], result[left]];
    invert(left); invert(right);
  }
  invert(0);
  return result;
}
// Node-based recursive
function invertTreeNode(root) {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTreeNode(root.left);
  invertTreeNode(root.right);
  return root;
}`,
    explanation: 'Recursively swap left and right children at every node. O(n) time and space.',
    tags: ['trees', 'recursion'],
  },
  {
    id: 71,
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    timeLimit: '15 min',
    description: 'Find the diameter of a binary tree — the length of the longest path between any two nodes (passing through any node).',
    examples: [
      { input: '[1,2,3,4,5]', output: '3 (path 4→2→1→3)' },
      { input: '[1,2]', output: '1' },
    ],
    hints: [
      'Diameter through a node = leftDepth + rightDepth',
      'Track global max as you compute depths recursively',
    ],
    solution: `function diameterOfBinaryTree(root) {
  let maxDiam = 0;
  function depth(node) {
    if (!node) return 0;
    const left = depth(node.left), right = depth(node.right);
    maxDiam = Math.max(maxDiam, left + right);
    return 1 + Math.max(left, right);
  }
  depth(root);
  return maxDiam;
}
// Array simulation
function diameterArray(tree) {
  let max = 0;
  function h(i) {
    if (i >= tree.length || tree[i] === null) return 0;
    const l = h(2*i+1), r = h(2*i+2);
    max = Math.max(max, l + r);
    return 1 + Math.max(l, r);
  }
  h(0);
  return max;
}`,
    explanation: 'Post-order DFS: compute left and right depths, update diameter at each node. O(n) time.',
    tags: ['trees', 'recursion', 'dfs'],
  },
  {
    id: 72,
    title: 'Path Sum',
    difficulty: 'Easy',
    topic: 'Trees',
    timeLimit: '15 min',
    description: 'Given a binary tree and a target sum, determine if the tree has a root-to-leaf path whose values sum to target.',
    examples: [
      { input: 'tree=[5,4,8,11,null,13,4,7,2], target=22', output: 'true (5→4→11→2)' },
      { input: 'tree=[1,2,3], target=5', output: 'false' },
    ],
    hints: [
      'Recursively subtract current node value from target',
      'At a leaf, check if remaining target is 0',
    ],
    solution: `function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  return hasPathSum(root.left, targetSum - root.val) ||
         hasPathSum(root.right, targetSum - root.val);
}
// Array simulation
function hasPathSumArray(tree, target, i = 0, curr = 0) {
  if (i >= tree.length || tree[i] === null) return false;
  curr += tree[i];
  const l = 2*i+1, r = 2*i+2;
  const isLeaf = (l >= tree.length || tree[l] === null) && (r >= tree.length || tree[r] === null);
  if (isLeaf) return curr === target;
  return hasPathSumArray(tree, target, l, curr) || hasPathSumArray(tree, target, r, curr);
}`,
    explanation: 'DFS: subtract current value, check at leaves if remainder is 0. O(n) time.',
    tags: ['trees', 'recursion', 'dfs'],
  },
  {
    id: 73,
    title: 'Level Order Traversal',
    difficulty: 'Medium',
    topic: 'Trees',
    timeLimit: '20 min',
    description: 'Return the level-order (BFS) traversal of a binary tree as a 2D array where each sub-array contains the values at that level.',
    examples: [
      { input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: '[1]', output: '[[1]]' },
    ],
    hints: [
      'Use a queue (array) for BFS',
      'Process all nodes at current level before moving to next',
      'Track level size to know when to start a new level',
    ],
    solution: `function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    explanation: 'BFS with queue. Process exactly queue.length nodes per level (snapshot the size before processing). O(n) time and space.',
    tags: ['trees', 'bfs', 'queue'],
  },
  {
    id: 74,
    title: 'Symmetric Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    timeLimit: '15 min',
    description: 'Check if a binary tree is symmetric (mirror image of itself).',
    examples: [
      { input: '[1,2,2,3,4,4,3]', output: 'true' },
      { input: '[1,2,2,null,3,null,3]', output: 'false' },
    ],
    hints: [
      'A tree is symmetric if left subtree is mirror of right subtree',
      'Two nodes are mirrors if: same value and their children are also mirrors (outer with outer, inner with inner)',
    ],
    solution: `function isSymmetric(root) {
  function isMirror(left, right) {
    if (!left && !right) return true;
    if (!left || !right) return false;
    return left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left);
  }
  return isMirror(root?.left, root?.right);
}`,
    explanation: 'Recursive mirror check: two nodes are mirrors if values match and outer children mirror outer, inner children mirror inner. O(n) time.',
    tags: ['trees', 'recursion'],
  },
  {
    id: 75,
    title: 'Merge Two Binary Trees',
    difficulty: 'Easy',
    topic: 'Trees',
    timeLimit: '15 min',
    description: 'Merge two binary trees by overlaying one on top of the other. Sum the values where both have nodes.',
    examples: [
      { input: 'tree1=[1,3,2,5], tree2=[2,1,3,null,4,null,7]', output: '[3,4,5,5,4,null,7]' },
      { input: 'tree1=[1], tree2=[1,2]', output: '[2,2]' },
    ],
    hints: [
      'If one node is null, return the other',
      'Otherwise create a node with summed values, recurse for children',
    ],
    solution: `function mergeTrees(root1, root2) {
  if (!root1) return root2;
  if (!root2) return root1;
  return {
    val: root1.val + root2.val,
    left: mergeTrees(root1.left, root2.left),
    right: mergeTrees(root1.right, root2.right)
  };
}`,
    explanation: 'Recursive merge: null nodes pass through the other tree\'s subtree unchanged. O(min(n1,n2)) time.',
    tags: ['trees', 'recursion'],
  },
  {
    id: 76,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    timeLimit: '10 min',
    description: 'You can climb 1 or 2 steps at a time. Given n stairs, how many distinct ways can you reach the top?',
    examples: [
      { input: 'n=2', output: '2 ([1+1] or [2])' },
      { input: 'n=3', output: '3 ([1+1+1], [1+2], [2+1])' },
    ],
    hints: [
      'Ways to reach step n = ways to reach step n-1 + ways to reach step n-2',
      'This is exactly the Fibonacci sequence',
    ],
    solution: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1, curr = 2;
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}`,
    explanation: 'Fibonacci pattern: dp[n] = dp[n-1] + dp[n-2]. Optimize to O(1) space by only keeping last two values.',
    tags: ['dynamic-programming', 'fibonacci'],
  },
  {
    id: 77,
    title: 'Binary Search',
    difficulty: 'Easy',
    topic: 'Search',
    timeLimit: '10 min',
    description: 'Given a sorted integer array and a target, return its index or -1 if not found. Must run in O(log n).',
    examples: [
      { input: '[-1,0,3,5,9,12], target=9', output: '4' },
      { input: '[-1,0,3,5,9,12], target=2', output: '-1' },
    ],
    hints: [
      'Maintain left and right pointers, compute mid',
      'If nums[mid] == target, return mid',
      'If target is larger, move left past mid; if smaller, move right before mid',
    ],
    solution: `function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    explanation: 'Halve search space each iteration: O(log n). Use left <= right and move pointers past mid to avoid infinite loops.',
    tags: ['search', 'arrays'],
  },
  {
    id: 78,
    title: 'Flatten Binary Tree to Linked List',
    difficulty: 'Medium',
    topic: 'Trees',
    timeLimit: '20 min',
    description: 'Flatten a binary tree to a "linked list" in-place (right-skewed tree, in pre-order). Simulate with an array.',
    examples: [
      { input: '[1,2,5,3,4,null,6]', output: '[1,null,2,null,3,null,4,null,5,null,6]' },
      { input: '[0]', output: '[0]' },
    ],
    hints: [
      'Pre-order traversal gives the correct node order',
      'Then chain them all to the right',
    ],
    solution: `function flatten(root) {
  if (!root) return [];
  // Pre-order traversal
  const preorder = [];
  function dfs(node) {
    if (!node) return;
    preorder.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return preorder;
}
// In-place for actual node objects
function flattenInPlace(root) {
  let curr = root;
  while (curr) {
    if (curr.left) {
      let rightmost = curr.left;
      while (rightmost.right) rightmost = rightmost.right;
      rightmost.right = curr.right;
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
}`,
    explanation: 'Morris traversal: find rightmost of left subtree, attach current right there, then move left to right. O(n) time, O(1) space.',
    tags: ['trees', 'recursion', 'dfs'],
  },

  // ─── DYNAMIC PROGRAMMING (79-90) ───
  {
    id: 79,
    title: 'House Robber',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '15 min',
    description: 'A robber cannot rob adjacent houses. Given an array of money at each house, return the maximum amount that can be robbed.',
    examples: [
      { input: '[1,2,3,1]', output: '4 (rob house 1 and 3: 1+3)' },
      { input: '[2,7,9,3,1]', output: '12 (rob 2,9,1)' },
    ],
    hints: [
      'dp[i] = max money from first i houses',
      'dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])',
      'Only need last two dp values — optimize to O(1) space',
    ],
    solution: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const num of nums) {
    const curr = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
    explanation: 'At each house, choose max of skipping (prev1) or robbing (prev2 + current). O(n) time, O(1) space.',
    tags: ['dynamic-programming', 'arrays'],
  },
  {
    id: 80,
    title: 'Coin Change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '20 min',
    description: 'Given coin denominations and a target amount, return the fewest number of coins to make that amount, or -1 if impossible.',
    examples: [
      { input: 'coins=[1,5,11], amount=15', output: '3 (5+5+5)' },
      { input: 'coins=[2], amount=3', output: '-1' },
    ],
    hints: [
      'dp[i] = min coins to make amount i',
      'dp[i] = min(dp[i - coin] + 1) for each coin',
      'Initialize dp[0]=0, rest to Infinity',
    ],
    solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    explanation: 'Bottom-up DP: build from amount 0 up. For each amount, try all coins. O(amount * coins.length) time.',
    tags: ['dynamic-programming', 'greedy'],
  },
  {
    id: 81,
    title: 'Unique Paths',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '15 min',
    description: 'A robot starts at the top-left of an m×n grid and can only move right or down. Count the number of unique paths to the bottom-right corner.',
    examples: [
      { input: 'm=3, n=7', output: '28' },
      { input: 'm=3, n=2', output: '3' },
    ],
    hints: [
      'dp[i][j] = paths to reach cell (i,j)',
      'dp[i][j] = dp[i-1][j] + dp[i][j-1]',
      'First row and column are all 1s',
    ],
    solution: `function uniquePaths(m, n) {
  const dp = Array.from({length: m}, () => new Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i-1][j] + dp[i][j-1];
    }
  }
  return dp[m-1][n-1];
}
// Math solution: C(m+n-2, m-1)
function uniquePathsMath(m, n) {
  let result = 1;
  for (let i = 0; i < Math.min(m, n) - 1; i++) {
    result = result * (m + n - 2 - i) / (i + 1);
  }
  return Math.round(result);
}`,
    explanation: 'DP: each cell is sum of paths from above and left. First row/col are all 1s (only one way to reach them). O(m*n) time and space.',
    tags: ['dynamic-programming', 'math'],
  },
  {
    id: 82,
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '20 min',
    description: 'Given an integer array, return the length of the longest strictly increasing subsequence.',
    examples: [
      { input: '[10,9,2,5,3,7,101,18]', output: '4 ([2,3,7,101])' },
      { input: '[0,1,0,3,2,3]', output: '4' },
    ],
    hints: [
      'dp[i] = LIS ending at index i',
      'dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]',
      'Binary search approach achieves O(n log n)',
    ],
    solution: `function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);
  let maxLen = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}
// O(n log n) with patience sorting
function lengthOfLISOptimal(nums) {
  const tails = [];
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; tails[mid] < num ? lo = mid + 1 : hi = mid; }
    tails[lo] = num;
  }
  return tails.length;
}`,
    explanation: 'O(n²) DP or O(n log n) patience sorting. DP: for each element, find longest increasing sequence ending there.',
    tags: ['dynamic-programming', 'binary-search'],
  },
  {
    id: 83,
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '20 min',
    description: 'Given two strings, return the length of their longest common subsequence (characters don\'t need to be adjacent).',
    examples: [
      { input: '"abcde" and "ace"', output: '3 ("ace")' },
      { input: '"abc" and "abc"', output: '3' },
    ],
    hints: [
      'dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]',
      'If chars match: dp[i][j] = dp[i-1][j-1] + 1',
      'If not: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    ],
    solution: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`,
    explanation: 'Classic 2D DP: if chars match extend the sequence, else take the best of skipping one char from either string. O(m*n) time and space.',
    tags: ['dynamic-programming', 'strings'],
  },
  {
    id: 84,
    title: 'Edit Distance',
    difficulty: 'Hard',
    topic: 'Dynamic Programming',
    timeLimit: '25 min',
    description: 'Given two strings, return the minimum number of operations (insert, delete, replace a character) to convert word1 to word2.',
    examples: [
      { input: '"horse" and "ros"', output: '3' },
      { input: '"intention" and "execution"', output: '5' },
    ],
    hints: [
      'dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1]',
      'If chars match: dp[i][j] = dp[i-1][j-1]',
      'If not: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])',
    ],
    solution: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({length: m+1}, (_, i) =>
    Array.from({length: n+1}, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i-1] === word2[j-1]) dp[i][j] = dp[i-1][j-1];
      else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}`,
    explanation: 'Wagner-Fischer algorithm: three operations map to three neighboring DP cells. Base cases: converting to/from empty string costs the string length.',
    tags: ['dynamic-programming', 'strings'],
  },
  {
    id: 85,
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '20 min',
    description: 'Given an array, determine if it can be partitioned into two subsets with equal sum.',
    examples: [
      { input: '[1,5,11,5]', output: 'true ([1,5,5] and [11])' },
      { input: '[1,2,3,5]', output: 'false' },
    ],
    hints: [
      'Total sum must be even (odd total is impossible)',
      'Find if any subset sums to total/2',
      'Classic 0/1 knapsack DP',
    ],
    solution: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const dp = new Set([0]);
  for (const num of nums) {
    const next = new Set(dp);
    for (const s of dp) { if (s + num <= target) next.add(s + num); }
    if (next.has(target)) return true;
    dp.clear(); for (const v of next) dp.add(v);
  }
  return dp.has(target);
}`,
    explanation: 'Track all achievable sums as we add numbers. If we can reach target (totalSum/2), partition exists. O(n * target) time.',
    tags: ['dynamic-programming', 'arrays'],
  },
  {
    id: 86,
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '20 min',
    description: 'Given an integer array, find the contiguous subarray that has the largest product and return its product.',
    examples: [
      { input: '[2,3,-2,4]', output: '6 ([2,3])' },
      { input: '[-2,0,-1]', output: '0' },
    ],
    hints: [
      'Track both max and min products (min can become max with negative)',
      'Negative * negative = positive (so track minimum too)',
    ],
    solution: `function maxProduct(nums) {
  let maxProd = nums[0], minProd = nums[0], result = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const temp = maxProd;
    maxProd = Math.max(nums[i], maxProd * nums[i], minProd * nums[i]);
    minProd = Math.min(nums[i], temp * nums[i], minProd * nums[i]);
    result = Math.max(result, maxProd);
  }
  return result;
}`,
    explanation: 'Track both max and min products because a negative*negative = positive. Update both at each step. O(n) time, O(1) space.',
    tags: ['dynamic-programming', 'arrays'],
  },
  {
    id: 87,
    title: '0/1 Knapsack',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    timeLimit: '25 min',
    description: 'Given weights and values of items and a knapsack capacity, find the maximum value that can fit (each item used at most once).',
    examples: [
      { input: 'weights=[2,3,4], values=[3,4,5], capacity=5', output: '7 (items 0 and 1: weight 2+3=5, value 3+4=7)' },
      { input: 'weights=[1,2,3], values=[6,10,12], capacity=5', output: '22' },
    ],
    hints: [
      'dp[i][w] = max value using first i items with capacity w',
      'Either skip item i or include it (if weight fits)',
    ],
    solution: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({length: n+1}, () => new Array(capacity+1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i-1][w]; // skip
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);
      }
    }
  }
  return dp[n][capacity];
}`,
    explanation: 'Classic 0/1 knapsack: for each item and capacity, choose max of including or excluding. O(n * capacity) time and space.',
    tags: ['dynamic-programming', 'arrays'],
  },
  {
    id: 88,
    title: 'Word Search',
    difficulty: 'Medium',
    topic: 'Recursion',
    timeLimit: '25 min',
    description: 'Given a 2D character grid and a word, return true if the word exists in the grid (horizontally or vertically connected cells, each cell used once).',
    examples: [
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"', output: 'true' },
      { input: 'same grid, word="ABCB"', output: 'false' },
    ],
    hints: [
      'DFS/backtracking from each cell matching the first character',
      'Mark visited cells temporarily (e.g., replace with #)',
      'Restore the cell after exploring',
    ],
    solution: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[i]) return false;
    const temp = board[r][c];
    board[r][c] = '#'; // mark visited
    const found = dfs(r+1,c,i+1) || dfs(r-1,c,i+1) || dfs(r,c+1,i+1) || dfs(r,c-1,i+1);
    board[r][c] = temp; // restore
    return found;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,
    explanation: 'DFS with backtracking: mark cell as visited (#), recurse in 4 directions, restore. O(rows * cols * 4^len) time.',
    tags: ['recursion', 'backtracking', 'dfs'],
  },
  {
    id: 89,
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    topic: 'Recursion',
    timeLimit: '20 min',
    description: 'Given n pairs of parentheses, generate all combinations of well-formed parentheses.',
    examples: [
      { input: 'n=3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: 'n=1', output: '["()"]' },
    ],
    hints: [
      'Add ( if open count < n',
      'Add ) if close count < open count',
      'Base case: both counts equal n',
    ],
    solution: `function generateParenthesis(n) {
  const result = [];
  function backtrack(curr, open, close) {
    if (curr.length === 2 * n) { result.push(curr); return; }
    if (open < n) backtrack(curr + '(', open + 1, close);
    if (close < open) backtrack(curr + ')', open, close + 1);
  }
  backtrack('', 0, 0);
  return result;
}`,
    explanation: 'Backtracking: add ( when we have budget, add ) only when it won\'t close more than opened. Elegant recursive solution.',
    tags: ['recursion', 'backtracking', 'strings'],
  },
  {
    id: 90,
    title: 'Subset Sum',
    difficulty: 'Medium',
    topic: 'Recursion',
    timeLimit: '20 min',
    description: 'Generate all subsets (power set) of an array.',
    examples: [
      { input: '[1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
      { input: '[0]', output: '[[],[0]]' },
    ],
    hints: [
      'For each element, either include it or exclude it',
      'Use backtracking or iterative approach (for each new element, add it to all existing subsets)',
    ],
    solution: `function subsets(nums) {
  const result = [[]];
  for (const num of nums) {
    const newSubsets = result.map(s => [...s, num]);
    result.push(...newSubsets);
  }
  return result;
}
// Backtracking approach
function subsetsBacktrack(nums) {
  const result = [];
  function bt(start, curr) {
    result.push([...curr]);
    for (let i = start; i < nums.length; i++) {
      curr.push(nums[i]);
      bt(i + 1, curr);
      curr.pop();
    }
  }
  bt(0, []);
  return result;
}`,
    explanation: 'Iterative: for each number, duplicate all existing subsets and add the number. Results in 2^n subsets. O(2^n * n) time.',
    tags: ['recursion', 'backtracking', 'arrays'],
  },

  // ─── JAVASCRIPT SPECIFIC (91-105) ───
  {
    id: 91,
    title: 'Implement Array.map',
    difficulty: 'Easy',
    topic: 'JavaScript',
    timeLimit: '10 min',
    description: 'Implement Array.prototype.map from scratch. It should take a callback and return a new array with each element transformed.',
    examples: [
      { input: 'myMap([1,2,3], x => x*2)', output: '[2,4,6]' },
      { input: 'myMap(["a","b"], s => s.toUpperCase())', output: '["A","B"]' },
    ],
    hints: [
      'Iterate through the array with the index',
      'Call callback(element, index, array) for each element',
      'Collect results in a new array',
    ],
    solution: `Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};
// Standalone version
function myMap(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) result.push(callback(arr[i], i, arr));
  return result;
}`,
    explanation: 'Call callback with (element, index, array). Collect results. The native map passes all three arguments to the callback.',
    tags: ['javascript', 'arrays', 'higher-order-functions'],
  },
  {
    id: 92,
    title: 'Implement Array.filter',
    difficulty: 'Easy',
    topic: 'JavaScript',
    timeLimit: '10 min',
    description: 'Implement Array.prototype.filter from scratch. Return a new array with only elements for which the callback returns truthy.',
    examples: [
      { input: 'myFilter([1,2,3,4], x => x%2===0)', output: '[2,4]' },
      { input: 'myFilter(["hi","","bye",""], Boolean)', output: '["hi","bye"]' },
    ],
    hints: [
      'Only include elements where callback returns truthy',
      'Call callback(element, index, array)',
    ],
    solution: `Array.prototype.myFilter = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) result.push(this[i]);
  }
  return result;
};
function myFilter(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr)) result.push(arr[i]);
  }
  return result;
}`,
    explanation: 'Same pattern as map but only push elements where callback is truthy. Always check the actual element, not the callback result.',
    tags: ['javascript', 'arrays', 'higher-order-functions'],
  },
  {
    id: 93,
    title: 'Implement Array.reduce',
    difficulty: 'Easy',
    topic: 'JavaScript',
    timeLimit: '15 min',
    description: 'Implement Array.prototype.reduce from scratch, supporting both with and without an initial value.',
    examples: [
      { input: 'myReduce([1,2,3,4], (acc,x)=>acc+x, 0)', output: '10' },
      { input: 'myReduce([1,2,3,4], (acc,x)=>acc+x)', output: '10 (no initial value)' },
    ],
    hints: [
      'If initial value provided, accumulator starts at initial value and index at 0',
      'If no initial value, accumulator starts at arr[0] and index at 1',
      'Throw TypeError on empty array with no initial value',
    ],
    solution: `Array.prototype.myReduce = function(callback, initialValue) {
  let acc, startIdx;
  if (arguments.length >= 2) {
    acc = initialValue; startIdx = 0;
  } else {
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[0]; startIdx = 1;
  }
  for (let i = startIdx; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};`,
    explanation: 'Handle both signatures. Without initial value, use first element as accumulator. Pass (acc, current, index, array) to callback.',
    tags: ['javascript', 'arrays', 'higher-order-functions'],
  },
  {
    id: 94,
    title: 'Implement Function.bind',
    difficulty: 'Medium',
    topic: 'JavaScript',
    timeLimit: '20 min',
    description: 'Implement Function.prototype.bind from scratch. It should create a new function with a fixed "this" and optionally pre-filled arguments.',
    examples: [
      { input: 'const greet = function(greeting) { return greeting + " " + this.name; }; greet.myBind({name:"Alice"})("Hello")', output: '"Hello Alice"' },
      { input: 'const add = (a,b) => a+b; const add5 = add.myBind(null,5); add5(3)', output: '8' },
    ],
    hints: [
      'Return a new function that calls the original with apply',
      'Combine pre-filled args with new args',
      'Use closures to capture the context and args',
    ],
    solution: `Function.prototype.myBind = function(context, ...preArgs) {
  const fn = this;
  return function(...args) {
    return fn.apply(context, [...preArgs, ...args]);
  };
};`,
    explanation: 'Closure captures the original function, context, and pre-filled args. Returned function spreads both pre-filled and new args. O(1) per call.',
    tags: ['javascript', 'closures', 'this'],
  },
  {
    id: 95,
    title: 'Implement Function.call',
    difficulty: 'Easy',
    topic: 'JavaScript',
    timeLimit: '15 min',
    description: 'Implement Function.prototype.call from scratch. It should invoke the function with a given "this" context and arguments.',
    examples: [
      { input: 'function greet() { return "Hello " + this.name; } greet.myCall({name:"Bob"})', output: '"Hello Bob"' },
      { input: 'Math.max.myCall(null, 1, 2, 3)', output: '3' },
    ],
    hints: [
      'Temporarily assign the function as a property on the context',
      'Call it, then delete the property',
      'Use a Symbol key to avoid overwriting existing properties',
    ],
    solution: `Function.prototype.myCall = function(context, ...args) {
  const ctx = context || globalThis;
  const key = Symbol('fn');
  ctx[key] = this;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};`,
    explanation: 'Temporarily attach function to the context object so "this" inside the function points to context. Symbol key prevents collisions.',
    tags: ['javascript', 'this', 'prototype'],
  },
  {
    id: 96,
    title: 'Flatten to Depth N',
    difficulty: 'Medium',
    topic: 'JavaScript',
    timeLimit: '15 min',
    description: 'Implement Array.flat() that flattens a nested array to a specified depth. Depth of Infinity flattens completely.',
    examples: [
      { input: 'flattenDepth([1,[2,[3,[4]]],5], 1)', output: '[1,2,[3,[4]],5]' },
      { input: 'flattenDepth([1,[2,[3]]], Infinity)', output: '[1,2,3]' },
    ],
    hints: [
      'Recursively flatten, decrementing depth at each level',
      'Base case: depth 0 returns the array as-is',
    ],
    solution: `function flattenDepth(arr, depth = 1) {
  if (depth === 0) return [...arr];
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenDepth(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
    explanation: 'Recursive flatten with depth tracking. At each level, if item is array and depth > 0, recurse with depth-1. O(total elements) time.',
    tags: ['javascript', 'arrays', 'recursion'],
  },
  {
    id: 97,
    title: 'Implement Debounce',
    difficulty: 'Medium',
    topic: 'Closures',
    timeLimit: '20 min',
    description: 'Implement a debounce function that delays invoking fn until after delay ms have elapsed since the last invocation.',
    examples: [
      { input: 'debounce(fn, 300) — called 5 times rapidly', output: 'fn called once, 300ms after last call' },
      { input: 'debounce(fn, 300) — called, wait 400ms, call again', output: 'fn called twice (separate debounce windows)' },
    ],
    hints: [
      'Store a timeoutId in closure',
      'clearTimeout on every call, then setTimeout',
      'Function only executes when no new calls arrive within the delay',
    ],
    solution: `function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`,
    explanation: 'Closure keeps timeoutId alive between calls. Each call cancels and restarts the timer. Only fires when quiet for the full delay period.',
    tags: ['closures', 'timing', 'performance'],
  },
  {
    id: 98,
    title: 'Implement Throttle',
    difficulty: 'Medium',
    topic: 'Closures',
    timeLimit: '20 min',
    description: 'Implement a throttle function that ensures fn is called at most once per limit ms, regardless of how many times it is invoked.',
    examples: [
      { input: 'throttle(fn, 100) — called 10x in 50ms', output: 'fn executes once immediately' },
      { input: 'throttle(fn, 100) — called again after 100ms', output: 'fn executes again (new window)' },
    ],
    hints: [
      'Use a boolean flag "inThrottle"',
      'Execute immediately on first call, set flag',
      'Reset flag after the interval using setTimeout',
    ],
    solution: `function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}`,
    explanation: 'Execute on first call, block further calls for limit ms. Unlike debounce, throttle fires on the LEADING edge. Use for scroll/resize handlers.',
    tags: ['closures', 'timing', 'performance'],
  },
  {
    id: 99,
    title: 'Deep Clone Object',
    difficulty: 'Medium',
    topic: 'Objects',
    timeLimit: '20 min',
    description: 'Implement a deep clone that creates a fully independent copy of an object (including nested objects and arrays). Modifying the clone must not affect the original.',
    examples: [
      { input: 'deepClone({a:1, b:{c:2}})', output: 'New object — changing clone.b.c does not affect original' },
      { input: 'deepClone([1,[2,3],{x:4}])', output: '[1,[2,3],{x:4}] — fully independent' },
    ],
    hints: [
      'Base case: return primitives and null as-is',
      'typeof null === "object" — check for null first!',
      'Handle Date, Array, and plain Object separately',
    ],
    solution: `function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value);
  if (Array.isArray(value)) return value.map(deepClone);
  const cloned = {};
  for (const key of Object.keys(value)) cloned[key] = deepClone(value[key]);
  return cloned;
}
// Modern built-in (handles more edge cases):
// structuredClone(obj)`,
    explanation: 'Recursive clone: handle each type. typeof null trick: always check for null before checking for object. structuredClone() is the modern native solution.',
    tags: ['objects', 'recursion'],
  },
  {
    id: 100,
    title: 'Memoize Function',
    difficulty: 'Medium',
    topic: 'Closures',
    timeLimit: '15 min',
    description: 'Implement a memoize function that caches results. Same arguments should return the cached result without re-executing the function.',
    examples: [
      { input: 'memoize(expensiveFn)(5) — first call', output: 'Computed result (slow)' },
      { input: 'memoize(expensiveFn)(5) — second call', output: 'Cached result (instant)' },
    ],
    hints: [
      'Use a Map as cache in closure',
      'Serialize args with JSON.stringify for the key',
      'Check cache before executing',
    ],
    solution: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    explanation: 'Closure holds the cache Map. JSON.stringify converts args to a stable string key. Works for pure functions (same input → same output).',
    tags: ['closures', 'optimization', 'cache'],
  },
  {
    id: 101,
    title: 'Promise.all Implementation',
    difficulty: 'Hard',
    topic: 'Promises',
    timeLimit: '25 min',
    description: 'Implement Promise.all that resolves with all results when all promises resolve, or rejects immediately when any rejects.',
    examples: [
      { input: 'promiseAll([Promise.resolve(1), Promise.resolve(2)])', output: 'Resolves with [1,2]' },
      { input: 'promiseAll([Promise.resolve(1), Promise.reject("err")])', output: 'Rejects with "err"' },
    ],
    hints: [
      'Use result[index] not push to maintain order',
      'Track resolvedCount — resolve when all done',
      'Any rejection immediately rejects the outer promise',
    ],
    solution: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return; }
    const results = new Array(promises.length);
    let resolved = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(val => {
          results[i] = val;
          if (++resolved === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}`,
    explanation: 'Use index assignment to maintain order. Track resolved count — when all done, resolve. First rejection immediately rejects all.',
    tags: ['promises', 'async'],
  },
  {
    id: 102,
    title: 'Compose Functions',
    difficulty: 'Medium',
    topic: 'Functional Programming',
    timeLimit: '15 min',
    description: 'Implement compose: takes multiple functions and returns a new function that applies them right-to-left. compose(f,g,h)(x) = f(g(h(x))).',
    examples: [
      { input: 'compose(double, addOne)(5)', output: '12 — addOne(5)=6, double(6)=12' },
      { input: 'compose(square, double)(3)', output: '36 — double(3)=6, square(6)=36' },
    ],
    hints: [
      'Use reduceRight to apply right-to-left',
      'Initial value is the input x',
    ],
    solution: `function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
// Usage
const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;
const transform = compose(square, double, addOne);
transform(3); // square(double(addOne(3))) = square(8) = 64`,
    explanation: 'reduceRight iterates from end to start. Threading the result of each function into the next. Mathematical composition convention.',
    tags: ['functional', 'higher-order-functions'],
  },
  {
    id: 103,
    title: 'Pipe Functions',
    difficulty: 'Easy',
    topic: 'Functional Programming',
    timeLimit: '10 min',
    description: 'Implement pipe: takes multiple functions and applies them left-to-right. pipe(f,g,h)(x) = h(g(f(x))).',
    examples: [
      { input: 'pipe(addOne, double)(5)', output: '12 — addOne(5)=6, double(6)=12' },
      { input: 'pipe(trim, toLowerCase)("  HELLO  ")', output: '"hello"' },
    ],
    hints: [
      'Same as compose but use reduce (left to right) instead of reduceRight',
    ],
    solution: `function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}
// Usage
const trim = s => s.trim();
const toLowerCase = s => s.toLowerCase();
const normalize = pipe(trim, toLowerCase);
normalize('  Hello World  '); // 'hello world'`,
    explanation: 'pipe = compose with left-to-right order. Use reduce instead of reduceRight. More intuitive for data pipelines.',
    tags: ['functional', 'higher-order-functions'],
  },
  {
    id: 104,
    title: 'Curry Function',
    difficulty: 'Hard',
    topic: 'Functional Programming',
    timeLimit: '25 min',
    description: 'Implement a curry function that transforms a multi-argument function into a chain of single-argument functions. curry(add)(1)(2)(3) = add(1,2,3).',
    examples: [
      { input: 'curry(add)(1)(2)(3)', output: '6' },
      { input: 'curry(add)(1,2)(3)', output: '6 (supports partial application)' },
    ],
    hints: [
      'fn.length gives the expected arity',
      'If enough args collected, call the function',
      'If not, return a function that collects more args',
    ],
    solution: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return function(...more) {
      return curried.apply(this, [...args, ...more]);
    };
  };
}
// Usage
const add = (a, b, c) => a + b + c;
const add1 = curry(add)(1);
const add1and2 = add1(2);
add1and2(3); // 6`,
    explanation: 'Check collected args against fn.length (arity). If enough, call. If not, return a function that appends and retries. Enables partial application.',
    tags: ['functional', 'closures', 'higher-order-functions'],
  },
  {
    id: 105,
    title: 'Get Nested Value',
    difficulty: 'Medium',
    topic: 'Objects',
    timeLimit: '15 min',
    description: 'Safely access a deeply nested property by a dot-separated path string. Return undefined (not an error) if any part of the path doesn\'t exist.',
    examples: [
      { input: 'get({a:{b:{c:42}}}, "a.b.c")', output: '42' },
      { input: 'get({a:{b:{c:42}}}, "a.x.c")', output: 'undefined (no error)' },
    ],
    hints: [
      'Split path by "."',
      'Reduce: at each step access the key, return undefined if null/undefined',
    ],
    solution: `function get(obj, path) {
  return path.split('.').reduce((curr, key) => curr != null ? curr[key] : undefined, obj);
}
// With default value
function getWithDefault(obj, path, defaultVal) {
  const result = get(obj, path);
  return result !== undefined ? result : defaultVal;
}
// Usage
const data = { user: { profile: { name: 'Alex' } } };
get(data, 'user.profile.name'); // 'Alex'
get(data, 'user.address.city'); // undefined`,
    explanation: 'reduce over path keys. At each step, safely access the next level only if current is non-null. Mirrors optional chaining (?.) behavior.',
    tags: ['objects', 'functional'],
  },

  // ─── SORTING & MATH (106-115) ───
  {
    id: 106,
    title: 'Bubble Sort',
    difficulty: 'Easy',
    topic: 'Sorting',
    timeLimit: '10 min',
    description: 'Implement bubble sort: repeatedly swap adjacent elements if they are in the wrong order.',
    examples: [
      { input: '[64,34,25,12,22,11,90]', output: '[11,12,22,25,34,64,90]' },
      { input: '[1]', output: '[1]' },
    ],
    hints: [
      'Outer loop n-1 passes, inner loop compares adjacent pairs',
      'After each pass, the largest unsorted element "bubbles" to its position',
      'Optimize by stopping if no swaps occurred in a pass',
    ],
    solution: `function bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted
  }
  return a;
}`,
    explanation: 'O(n²) worst case but O(n) best case (already sorted with swapped optimization). Stable sort.',
    tags: ['sorting', 'arrays'],
  },
  {
    id: 107,
    title: 'Merge Sort',
    difficulty: 'Medium',
    topic: 'Sorting',
    timeLimit: '20 min',
    description: 'Implement merge sort: divide array in half, recursively sort each half, then merge them.',
    examples: [
      { input: '[38,27,43,3,9,82,10]', output: '[3,9,10,27,38,43,82]' },
      { input: '[1,2]', output: '[1,2]' },
    ],
    hints: [
      'Base case: array of 0 or 1 elements is sorted',
      'Split at midpoint, sort left and right halves',
      'Merge two sorted arrays using two-pointer technique',
    ],
    solution: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    explanation: 'O(n log n) time, O(n) space. Divide and conquer: split in half, sort recursively, merge. Stable sort.',
    tags: ['sorting', 'divide-and-conquer', 'recursion'],
  },
  {
    id: 108,
    title: 'Quick Sort',
    difficulty: 'Medium',
    topic: 'Sorting',
    timeLimit: '20 min',
    description: 'Implement quick sort: pick a pivot, partition array into elements less than and greater than pivot, then recursively sort each part.',
    examples: [
      { input: '[10,7,8,9,1,5]', output: '[1,5,7,8,9,10]' },
      { input: '[3,1,2]', output: '[1,2,3]' },
    ],
    hints: [
      'Pick a pivot (last element is simple)',
      'Partition: elements < pivot go left, > pivot go right',
      'Recursively sort left and right parts',
    ],
    solution: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.slice(0, -1).filter(x => x <= pivot);
  const right = arr.slice(0, -1).filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
// In-place version (Lomuto partition)
function quickSortInPlace(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const pi = partition(arr, lo, hi);
    quickSortInPlace(arr, lo, pi - 1);
    quickSortInPlace(arr, pi + 1, hi);
  }
  return arr;
}
function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  }
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  return i + 1;
}`,
    explanation: 'O(n log n) average, O(n²) worst. Functional version is clear but uses extra space. In-place Lomuto partition is O(1) space.',
    tags: ['sorting', 'divide-and-conquer', 'recursion'],
  },
  {
    id: 109,
    title: 'Count Bits',
    difficulty: 'Easy',
    topic: 'Bit Manipulation',
    timeLimit: '10 min',
    description: 'Count the number of 1-bits (set bits) in the binary representation of an integer.',
    examples: [
      { input: 'n=11 (1011 in binary)', output: '3' },
      { input: 'n=128 (10000000)', output: '1' },
    ],
    hints: [
      'Brian Kernighan\'s trick: n & (n-1) clears the lowest set bit',
      'Count iterations until n becomes 0',
      'Or use n.toString(2).split("0").join("").length',
    ],
    solution: `function countBits(n) {
  let count = 0;
  while (n) {
    n &= (n - 1); // clear lowest set bit
    count++;
  }
  return count;
}
// Alternative
const popcount = n => n.toString(2).split('').filter(b => b === '1').length;`,
    explanation: 'Brian Kernighan\'s algorithm: n & (n-1) clears the rightmost set bit. Count iterations. O(number of set bits) time.',
    tags: ['bit-manipulation', 'math'],
  },
  {
    id: 110,
    title: 'Power of Two',
    difficulty: 'Easy',
    topic: 'Math',
    timeLimit: '5 min',
    description: 'Determine if a given integer n is a power of two.',
    examples: [
      { input: 'n=16', output: 'true (2^4)' },
      { input: 'n=3', output: 'false' },
    ],
    hints: [
      'Powers of two in binary have exactly one set bit',
      'n & (n-1) === 0 iff n is a power of two',
      'Also check n > 0',
    ],
    solution: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
// Loop approach
function isPowerOfTwoLoop(n) {
  if (n <= 0) return false;
  while (n > 1) {
    if (n % 2 !== 0) return false;
    n = Math.floor(n / 2);
  }
  return true;
}`,
    explanation: 'Powers of two have exactly one set bit. n & (n-1) clears that bit; result is 0 only for powers of two.',
    tags: ['bit-manipulation', 'math'],
  },
  {
    id: 111,
    title: 'Reverse Integer',
    difficulty: 'Medium',
    topic: 'Math',
    timeLimit: '10 min',
    description: 'Reverse the digits of a 32-bit signed integer. Return 0 if the result overflows the range [-2³¹, 2³¹ - 1].',
    examples: [
      { input: '123', output: '321' },
      { input: '-120', output: '-21' },
    ],
    hints: [
      'Convert to string, handle the sign, reverse, convert back',
      'Check if result is within 32-bit signed integer range',
    ],
    solution: `function reverse(x) {
  const MAX = 2 ** 31 - 1, MIN = -(2 ** 31);
  const sign = x < 0 ? -1 : 1;
  const reversed = parseInt(Math.abs(x).toString().split('').reverse().join('')) * sign;
  return reversed > MAX || reversed < MIN ? 0 : reversed;
}`,
    explanation: 'Handle sign separately, reverse absolute value digits, reapply sign, check 32-bit overflow.',
    tags: ['math', 'strings'],
  },
  {
    id: 112,
    title: 'Palindrome Number',
    difficulty: 'Easy',
    topic: 'Math',
    timeLimit: '10 min',
    description: 'Determine whether an integer is a palindrome without converting it to a string.',
    examples: [
      { input: '121', output: 'true' },
      { input: '-121', output: 'false (reads -121 forward, 121- backward)' },
    ],
    hints: [
      'Negative numbers are never palindromes',
      'Numbers ending in 0 (except 0 itself) are never palindromes',
      'Reverse only the second half and compare with first half',
    ],
    solution: `function isPalindromeNum(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + x % 10;
    x = Math.floor(x / 10);
  }
  return x === reversed || x === Math.floor(reversed / 10);
}`,
    explanation: 'Reverse only half the digits (stop when reversed >= x). For even length: x === reversed. For odd: x === reversed/10 (middle digit in reversed).',
    tags: ['math'],
  },
  {
    id: 113,
    title: 'Find Kth Largest Element',
    difficulty: 'Medium',
    topic: 'Sorting',
    timeLimit: '15 min',
    description: 'Find the kth largest element in an unsorted array (not the kth distinct element).',
    examples: [
      { input: '[3,2,1,5,6,4], k=2', output: '5' },
      { input: '[3,2,3,1,2,4,5,5,6], k=4', output: '4' },
    ],
    hints: [
      'Sort descending and return index k-1',
      'Or use a min-heap of size k (O(n log k))',
      'Or use quickselect for average O(n)',
    ],
    solution: `function findKthLargest(nums, k) {
  // Simple: sort descending
  return nums.slice().sort((a, b) => b - a)[k - 1];
}
// Quickselect - O(n) average
function findKthLargestQS(nums, k) {
  const target = nums.length - k;
  function quickSelect(lo, hi) {
    const pivot = nums[hi];
    let p = lo;
    for (let i = lo; i < hi; i++) if (nums[i] <= pivot) [nums[p++], nums[i]] = [nums[i], nums[p-1]];
    [nums[p], nums[hi]] = [nums[hi], nums[p]];
    if (p === target) return nums[p];
    return p < target ? quickSelect(p + 1, hi) : quickSelect(lo, p - 1);
  }
  return quickSelect(0, nums.length - 1);
}`,
    explanation: 'Sort is O(n log n). Quickselect is O(n) average — partition like quicksort but only recurse into the relevant half.',
    tags: ['sorting', 'arrays'],
  },
  {
    id: 114,
    title: 'Search in 2D Matrix',
    difficulty: 'Medium',
    topic: 'Search',
    timeLimit: '15 min',
    description: 'Search for a target in an m×n matrix where each row is sorted and first integer of each row is greater than last of previous row.',
    examples: [
      { input: 'matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3', output: 'true' },
      { input: 'same matrix, target=13', output: 'false' },
    ],
    hints: [
      'Treat the matrix as a 1D sorted array and binary search',
      'Map mid index to (mid / cols, mid % cols)',
    ],
    solution: `function searchMatrix(matrix, target) {
  const rows = matrix.length, cols = matrix[0].length;
  let lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const val = matrix[Math.floor(mid / cols)][mid % cols];
    if (val === target) return true;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
    explanation: 'Treat m*n matrix as flattened 1D array: binary search with index mapping mid → (row=mid/cols, col=mid%cols). O(log(m*n)) time.',
    tags: ['search', 'binary-search', 'arrays'],
  },
  {
    id: 115,
    title: 'Event Emitter',
    difficulty: 'Hard',
    topic: 'Design Patterns',
    timeLimit: '30 min',
    description: 'Implement an EventEmitter class with on(event, listener), off(event, listener), emit(event, ...args), and once(event, listener) methods.',
    examples: [
      { input: 'emitter.on("data", fn); emitter.emit("data", 42)', output: 'fn called with 42' },
      { input: 'emitter.once("done", fn); emit twice', output: 'fn called only once' },
    ],
    hints: [
      'Use a Map of event → Set of callbacks',
      'on() adds, off() removes, emit() calls all',
      'once() wraps in a function that removes itself after first call',
    ],
    solution: `class EventEmitter {
  constructor() { this.events = new Map(); }
  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(listener);
    return this;
  }
  off(event, listener) {
    this.events.get(event)?.delete(listener);
    return this;
  }
  emit(event, ...args) {
    this.events.get(event)?.forEach(fn => fn(...args));
    return this;
  }
  once(event, listener) {
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }
}`,
    explanation: 'Map stores per-event listener sets. Set prevents duplicates. once() wraps the listener and self-removes after first call. Method chaining via return this.',
    tags: ['design-patterns', 'classes', 'pub-sub'],
  },

  // ─── MORE PROBLEMS (116-120) ───
  {
    id: 116,
    title: 'Fibonacci (Iterative + Memo)',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    timeLimit: '10 min',
    description: 'Return the nth Fibonacci number efficiently. fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2).',
    examples: [
      { input: 'n=10', output: '55' },
      { input: 'n=0', output: '0' },
    ],
    hints: [
      'Naive recursion is O(2^n) — avoid it',
      'Iterative with two variables is O(n) time, O(1) space',
      'Memoization (top-down) is O(n) time, O(n) space',
    ],
    solution: `// Iterative O(n) time O(1) space
function fib(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) [prev, curr] = [curr, prev + curr];
  return curr;
}
// Memoized recursive
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
  return memo[n];
}`,
    explanation: 'Iterative two-variable approach is optimal: O(n) time, O(1) space. Memoization trades space for readable recursive structure.',
    tags: ['dynamic-programming', 'recursion', 'fibonacci'],
  },
  {
    id: 117,
    title: 'Group By',
    difficulty: 'Easy',
    topic: 'Objects',
    timeLimit: '10 min',
    description: 'Given an array of objects and a key, group the objects by that key\'s value. Return an object where each key maps to an array of matching objects.',
    examples: [
      { input: '[{type:"fruit",name:"apple"},{type:"veggie",name:"carrot"},{type:"fruit",name:"pear"}], key="type"', output: '{fruit:[...],veggie:[...]}' },
      { input: '[{age:20},{age:30},{age:20}], key="age"', output: '{20:[...],30:[...]}' },
    ],
    hints: [
      'Use reduce to build the grouped object',
      'For each item, use item[key] as the bucket name',
    ],
    solution: `function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});
}
// One-liner with Object.groupBy (ES2024)
// Object.groupBy(arr, item => item[key])`,
    explanation: 'reduce accumulates into a dictionary. For each item, use item[key] as the bucket. ES2024 added Object.groupBy() as a native method.',
    tags: ['objects', 'arrays', 'functional'],
  },
  {
    id: 118,
    title: 'Flatten Nested Array',
    difficulty: 'Medium',
    topic: 'Recursion',
    timeLimit: '15 min',
    description: 'Flatten a deeply nested array to a single level without using Array.flat().',
    examples: [
      { input: '[1,[2,3],[4,[5,[6]]]]', output: '[1,2,3,4,5,6]' },
      { input: '[[1,2],[3,[4,5]]]', output: '[1,2,3,4,5]' },
    ],
    hints: [
      'Recursion: if item is array, flatten it recursively',
      'Use reduce + concat for clean functional style',
    ],
    solution: `function flattenArray(arr) {
  return arr.reduce((flat, item) =>
    Array.isArray(item) ? flat.concat(flattenArray(item)) : flat.concat(item)
  , []);
}
// Iterative with stack
function flattenIterative(arr) {
  const stack = [...arr], result = [];
  while (stack.length) {
    const item = stack.pop();
    Array.isArray(item) ? stack.push(...item) : result.unshift(item);
  }
  return result;
}`,
    explanation: 'Recursive reduce: for each item, either recurse or push. Iterative stack avoids call stack overflow for deeply nested arrays.',
    tags: ['arrays', 'recursion'],
  },
  {
    id: 119,
    title: 'Promise.race Implementation',
    difficulty: 'Medium',
    topic: 'Promises',
    timeLimit: '20 min',
    description: 'Implement Promise.race that resolves or rejects as soon as the first promise in the array settles (resolves or rejects).',
    examples: [
      { input: 'promiseRace([delay(300, 1), delay(100, 2)])', output: 'Resolves with 2 (fastest)' },
      { input: 'promiseRace([reject("err"), resolve(1)])', output: 'Rejects with "err" (first to settle)' },
    ],
    hints: [
      'Wrap all promises and attach resolve/reject to each',
      'The first one to settle wins',
    ],
    solution: `function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve).catch(reject);
    }
  });
}
// Usage
const delay = (ms, val) => new Promise(res => setTimeout(() => res(val), ms));
promiseRace([delay(300, 'slow'), delay(100, 'fast')]).then(console.log); // 'fast'`,
    explanation: 'Attach resolve/reject to all promises. The outer Promise constructor can only be resolved/rejected once — first settler wins.',
    tags: ['promises', 'async'],
  },
  {
    id: 120,
    title: 'Deep Equal',
    difficulty: 'Medium',
    topic: 'Objects',
    timeLimit: '20 min',
    description: 'Implement a deepEqual function that checks if two values are structurally equal (same type, same properties/values at all depths).',
    examples: [
      { input: 'deepEqual({a:1,b:{c:2}}, {a:1,b:{c:2}})', output: 'true' },
      { input: 'deepEqual({a:1}, {a:2})', output: 'false' },
    ],
    hints: [
      'Primitive comparison first: === handles most cases',
      'Check type and null separately',
      'For objects/arrays: compare keys and recursively compare values',
    ],
    solution: `function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(k => deepEqual(a[k], b[k]));
}`,
    explanation: 'Recursive structural comparison. Primitives use ===. Objects/arrays compare all keys recursively. O(n) where n is total number of nested values.',
    tags: ['objects', 'recursion'],
  },
];
