# dist-linkage
省市区选择器

## 项目背景
在工作开发中遇到需要根据服务端指定数据格式展示出```省市区```三级数据结构，且因为特殊的业务常见导致不能使用下拉选择之类的交互，因此开发了dist-linkage组件。

## Preview

#### Online

https://codesandbox.io/s/dist-linkage-crbwf

#### Local

```js

npm install // npm i

npm run dev

```

#### Demo file

> open /docs/index.html


## Installation

## Usage

#### Example

```js
render: function (h) {
    return h(
        "distLinkage",
        {
            props: {
                data: mockData,
                label: "name",
                keyword: "code",
                value: [500],
            },
            on: {
                onSelect: function (select) {
                    // 返回地区维度数据选择列表
                    console.log("选择：", select)
                }
            }
        }
    )
}
```

## Props

## API

## License

MIT

