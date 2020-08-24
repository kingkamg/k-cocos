/**
 * k-cocos 扩展库
 * 作者： kuokuo
 * 地址： https://github.com/KuoKuo666/k-cocos
 */

(function (global) {
    console.log('k-cocos v0.1');
    var cc = global.cc;

    cc.director._kSpeed = 1;
    var _originCalculateDeltaTime = cc.Director.prototype.calculateDeltaTime;
    cc.director.calculateDeltaTime = function (now) {
        _originCalculateDeltaTime.call(this, now);
        this._deltaTime *= this._kSpeed;
    }

    cc.kSpeed = function (speed) {
        cc.director._kSpeed = speed;
    }

    cc.kMultTouch = function (isOpen) {
        // 2.3.0 版本以上
        if (cc.macro.ENABLE_MULTI_TOUCH !== undefined) {
            cc.macro.ENABLE_MULTI_TOUCH = isOpen;
            return;
        }
        if (!isOpen) {
            // 低版本
            _cc && _cc.inputManager && (_cc.inputManager._maxTouches = 1);
            // QQ_PLAY
            CC_QQPLAY && BK && BK.inputManager && (BK.inputManager._maxTouches = 1);
        } else {
            // 低版本
            _cc && _cc.inputManager && (_cc.inputManager._maxTouches = 8);
            // QQ_PLAY
            CC_QQPLAY && BK && BK.inputManager && (BK.inputManager._maxTouches = 5);
        }
    }

    cc.kNode = function (node) {
        // kInfo 属性
        node._kInfo = 'init';
        Object.defineProperties(node, {
            kInfo: {
                get() {
                    return this._kInfo;
                },
                set(val) {
                    var old = this._kInfo;
                    this._kInfo = val;
                    this.kInfoCb && this.kInfoCb(val, old);
                }
            },
            kComponents: {
                get() {
                    return this._components;
                },
                set(val) {
                    console.error(`can not set kComponents, please use addComponent()`);
                }
            }
        });

        node.kChildByArray = function (arr) {
            var nodes = [];
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] === 'number') {
                    nodes[i] = this.children[arr[i]];
                } else {
                    nodes[i] = this.getChildByName(arr[i]);
                }
            }
            return nodes;
        }

        node.kHitTest = function (cb) {
            this._hitTest = cb;
        }

        return node;
    }

})(window)