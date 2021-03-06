const getDomList = (ulId, contentId) => {
  if (!ulId || !contentId) {
    throw new Error("miss ulId or contentId");
  }
  const liList = Array.from(document.getElementById(ulId).childNodes).filter(
    (i) => i.nodeType === 1 && i.nodeName.toUpperCase() === "LI"
  );
  const contentList = Array.from(
    document.getElementById(contentId).childNodes
  ).filter((i) => i.nodeType === 1 && i.nodeName.toUpperCase() === "DIV");
  return {
    liList,
    contentList,
  };
};

const fadeIn = (el) => {
  el.style.display = "block";
  el.style.opacity = 0;
  const timer = setInterval(() => {
    if (el.style.opacity < 1) {
      el.style.opacity = Number(el.style.opacity) + 0.1;
    } else {
      clearInterval(timer);
      el.style.display = "block";
    }
  }, 100);
  return el;
};

const fadeOut = (el) => {
  el.style.display = "block";
  el.style.opacity = 1;
  const timer = setInterval(() => {
    if (el.style.opacity > 0) {
      el.style.opacity = el.style.opacity - 0.1;
    } else {
      clearInterval(timer);
      el.style.display = "none";
    }
  }, 100);
  return el;
};

/**
 * @class Tab
 * @param trigger 'click' | 'mouseover' 触发方式
 * @param effect  'fade' 动画效果
 * @param invoke  Number 默认展示第几页
 * @param auto    [ Boolean , Number ] 是否自动轮播。false不切换,Number为间隔。
 */
class Tab {
  constructor(id, config = {}) {
    if (!id) {
      throw new Error("miss id");
    }
    const defaultConfig = {
      trigger: "click",
      effect: "default",
      invoke: 1,
      auto: false,
    };
    this.config = Object.assign(defaultConfig, config);
    const { liList, contentList } = getDomList("tab-wrapper", "content-warp");
    this.liList = liList;
    this.contentList = contentList;
    this.initEvent();
  }

  triggertLiInvoke(li) {
    let index = 0;
    const childNodes = Array.from(li.parentNode.childNodes).filter(
      (i) => i.nodeType === 1
    );
    const brotherNodeList = childNodes.filter((i, idx) => {
      if (i === li) index = idx;
      return i.nodeType === 1 && i !== li;
    });
    brotherNodeList.forEach((li) => {
      li.classList.remove("actived");
    });
    li.classList.add("actived");
    // 同时更新content
    this.updateContent(index);
  }

  updateContent(index) {
    const preIndex = this.contentList.findIndex(i => Array.from(i.classList).includes('current'))
    if(preIndex === index) return;
    const { effect } = this.config;
    if (effect === "default") {
      this.contentList.forEach((el, idx) => {
        el.classList.remove("current");
        if (idx === index) {
          el.classList.add("current");
        }
      });
    } else {
      const showContent = this.contentList[index];
      const hideContent = this.contentList.find((i) => {
        return Array.from(i.classList).includes("current");
      });
      fadeOut(hideContent);
      hideContent.classList.remove("current");
      fadeIn(showContent);
      showContent.classList.add("current");
    }
  }

  // 绑定事件
  initEvent() {
    const { trigger } = this.config;
    if (trigger !== "click" && trigger !== "mouseover") {
      throw new Error(`event Configuration must be click' of 'hover'`);
    }
    this.liList.forEach((li) => {
      li.addEventListener(trigger, () => {
        this.triggertLiInvoke(li);
      });
    });
  }

  // 获取配置参数
  getConfig() {
    return this.config;
  }
}

window.Tab = Tab;
