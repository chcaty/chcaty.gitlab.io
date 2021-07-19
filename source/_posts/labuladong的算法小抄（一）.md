---
title: labuladong的算法小抄（一）
date: 2021-07-12 14:41:06
categories: 读书笔记
tags:
 - 读书笔记
 - 技术
---

### 学习算法和刷题的框架思维

#### 数据结构的存储方式

数据结构的存储方式只有两种：数组（顺序存储）和链表（链式存储）。
<!--more-->

数组和链表的优缺点

* 数组由于是紧凑连续存储,可以随机访问，通过索引快速找到对应元素，而且相对节约存储空间。但正因为连续存储，内存空间必须一次性分配够，所以说数组如果要扩容，需要重新分配一块更大的空间，再把数据全部复制过去，时间复杂度 O(N)；而且你如果想在数组中间进行插入和删除，每次必须搬移后面的所有数据以保持连续，时间复杂度 O(N)。

* 链表因为元素不连续，而是靠指针指向下一个元素的位置，所以不存在数组的扩容问题；如果知道某一元素的前驱和后驱，操作指针即可删除该元素或者插入新元素，时间复杂度 O(1)。但是正因为存储空间不连续，你无法根据一个索引算出对应元素的地址，所以不能随机访问；而且由于每个元素必须存储指向前后元素位置的指针，会消耗相对更多的储存空间。

#### 数据结构的基本操作

数据结构种类很多，但它们存在的目的都是在不同的应用场景，尽可能高效地增删查改。

遍历和访问的几种框架

* 数组遍历框架，典型的线性迭代结构

    ```cs
    void traverse(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            // 迭代访问 arr[i]
        }
    }
    ```

* 链表遍历框架，兼具迭代和递归结构

    ```cs
    /* 基本的单链表节点 */
    class ListNode {
        int val;
        ListNode next;
    }

    void traverse(ListNode head) {
        for (ListNode p = head; p != null; p = p.next) {
            // 迭代访问 p.val
        }
    }

    void traverse(ListNode head) {
        // 递归访问 head.val
        traverse(head.next)
    }
    ```

* 二叉树遍历框架，典型的非线性递归遍历结构

    ```cs
    /* 基本的二叉树节点 */
    class TreeNode {
        int val;
        TreeNode left, right;
    }

    void traverse(TreeNode root) {
        traverse(root.left)
        traverse(root.right)
    }
    ```

### 手把手刷数据结构

#### 手把手刷链表题目

##### 递归反转链表的一部分

1. 递归反转整个链表

    ```cs
    ListNode reverse(ListNode head)
    {
        if(head.next == null) return head;
        ListNode last = reverse(head.next);
        head.next.next = head;
        head.next = null;
        return last;
    }
    ```

    ps：

    * 递归函数要有base case，如果链表只有一个节点的时候反转也是它自己，直接返回即可

        ```cs
        if(head.next == null) return head;
        ```

    * 当链表递归反转之后，新的头结点是last，而之前的head变成了最后一个节点，别忘了链表的末尾要指向null

        ```cs
        head.next = null;
        ```

2. 反转链表前N个节点

    ```cs
    ListNode successor =null;
    ListNode reverseN(ListNode head, int n)
    {
        if(n == 1)
        {
            // 记录第 n + 1 个节点
            successor = head.next;
            return head;
        }
        // 以 head.next 为起点，需要反转前 n - 1 个节点
        ListNode last = reverseN(head.next, n - 1);
        head.next.next = head;
        // 让反转之后的 head 节点和后面的节点连起来
        head.next = successor;
        return last;
    }
    ```

    ps：

    * base case 变为 n == 1，反转一个元素，就是它本身，同时要记录后驱节点。

    * head 节点在递归反转之后不一定是最后一个节点了，所以要记录后驱 successor（第n+1个节点），反转之后将head连接上。

3. 反转链表的一部分

    ```cs
    ListNode reverseBetween(ListNode head, int m, int n)
    {
        // base case
        if(m == 1)
        {
            return reverseN(head, n);
        }
        // 前进到反转的起点 触发 base case
        head.next = reverseBetween(head.next, m - 1, n - 1);
        return head;
    }
    ```

##### 如何k个一组反转链表

1. 分析问题

    大致的算法流程
    * 先反转以head开头的k个元素。
    * 将第k+1个元素作为head递归调用reverseKGroup函数。
    * 将上述两个过程的结果连接起来。

2. 代码实现

    ```cs
    // 反转以 a 为头结点的链表
    ListNode reverse(ListNode a)
    {
        ListNode pre, cur, nxt;
        pre = null; cur = a; nxt = a;
        while(cur != null)
        {
            nxt = cur.next;
            // 逐个节点反转
            cur.next = pre;
            // 更新指针位置
            pre = cur;
            cur = nxt;
        }
        // 返回反转后的头结点
        return pre;
    }

    // 反转区间 [a, b) 的元素，注意是左闭右开
    ListNode reverse(ListNode a, ListNode b)
    {
        ListNode pre, cur, nxt;
        pre = null; cur = a; nxt = a;
        // while 终止的条件改一下就行了
        while (cur != b) 
        {
            nxt = cur.next;
            cur.next = pre;
            pre = cur;
            cur = nxt;
        }
        // 返回反转后的头结点
        return pre;
    }

    // 实现reverseKGroup函数
    ListNode reverseKGroup(ListNode head, int k)
    {
        if(head == null) return null;
        // 区间[a, b) 包含 k 个待反转元素
        ListNode a, b;
        a = b = head;
        for(int i = 0; i < k; i++)
        {
            // 不足 k 个，不需要反转， base case
            if(b == null) return head;
        }
    }
    ```

##### 如何判断回文链表

1. 分析问题

    * 回文串是对称的，所以正着读和倒着读应该是一样的，这一特点是解决回文串问题的关键。
    * 寻找回文的核心思想是从中心向两端扩展。

2. 解题思路

    ```cs
    // 1.先通过[双指针技巧]中的快慢指针来找到链表的中点
    // 2.如果fast指针没有指向null，说明链表长度为奇数，slow还要再前进一步
    // 3.从slow开始反转后面的链表，现在就可以开始比较回文串了
    ListNode left = head;
    ListNode right = reverse(slow);

    while (right != null) 
    {
        if(left.val != right.val)
            return false;
        left = left.next;
        right = right.next;
    }
    return true;
    ```

#### 手把手刷二叉树

##### 手把手带你刷二叉树（第一期）

1. 二叉树的重要性

    快速排序就是个二叉树的前序遍历，归并排序就是个二叉树的后序遍历。

    快速排序的代码框架如下：

    ```cs
    void sort(int[] nums, int lo, int hi)
    {
        /****** 前序遍历位置 ******/
        // 通过交换元素构建分界点p
        int p = partition(nums, lo, hi);

        sort(nums, lo, p-1);
        sort(nums, p+1, hi);
    }
    ```

    归并排序的代码框架如下：

    ```cs
    void sort(int[] nums, int lo, int hi)
    {
        int mid = (lo + hi) / 2;
        sort(nums, lo, mid);
        sort(nums, mid + 1, hi);

        /****** 后序遍历位置 ******/
        // 合并两个排好序的子数组
        merge(nums, lo, mid, hi);
    }    
    ```

2. 写递归算法的秘诀

    写递归算法的关键是要明确函数的[定义]是什么，然后相信这个定义，利用这个定义推导最终结果，绝不要跳入递归的细节。

    写树相关的算法，简单说就是，先搞清楚当前 root 节点该做什么，然后根据函数定义递归调用子节点，递归调用会让孩子节点做相同的事情。

3. 算法实践

    * 翻转二叉树

        只要把二叉树上的每一个节点的左右子节点进行交换，最后的结果就是完全翻转之后的二叉树。

        解法代码：

        ```cs
        TreeNode invertTree(TreeNode root)
        {
            // base case
            if(root == null)
            {
                return null;
            }

            /****** 前序遍历位置 ******/
            // root 节点需要交换它的左右子节点
            TreeNode tmp = root.left;
            root.left = root.right;
            root.right = tmp;

            // 让左右子节点继续翻转它们的子节点
            invertTree(root.left);
            invertTree(root.right;

            return root;
        }
        ```

#### 二分查找

1. 二分查找框架

    ```cs
    int binarySearch（int[] nums, int target）
    {
        int left = 0, right = ...;

        while(...)
        {
            int mid = left + (right - left) /2;
            if(nums[mid] == target)
            {
                ...
            }
            else if (nums[mid] < target) 
            {
                left = ...
            }
            else if (nums[mid] > target) 
            {
                right = ...
            }
        }
        return ...;
    }
    ```

    ps:

    * 不要出现 else，而是把所有情况用 else if 写清楚，这样可以清楚地展现所有细节。
    * 计算 mid 时需要防止溢出，代码中 left + （right - left）/ 2 就和（lefty + right） / 2 的结果相同，但是防止了left和right太大直接相加导致溢出。

2. 寻找一个数（基本的二分搜索）

    ```cs
    int binarySearch(int[] nums, int target)
    {
        int left = 0;
        int right = nums.length -1;

        while(left <= right) {
            int mid = left + (right - left) / 2;
            if(nums[mid] == target)
                return mid;
            else if(nums[mid] < target)
                left = mid +1;
            else if (nums[mid] > target)
                right = mid -1;
        }
        return -1;
    }
    ```
