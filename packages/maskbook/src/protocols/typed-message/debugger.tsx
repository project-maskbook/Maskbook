import * as React from 'jsx-jsonml-devtools-renderer'
import {
    TypedMessage,
    TypedMessageCompound,
    TypedMessageImage,
    TypedMessageText,
    isTypedMessageCompound,
    isTypedMessageText,
    isTypedMessageImage,
} from './types'

class TypedMessageFormatter {
    isTypedMessage(obj: unknown): obj is TypedMessage {
        if (typeof obj !== 'object' || obj === null) return false
        if (!('version' in obj)) return false
        if (!('meta' in obj)) return false
        if (!('type' in obj)) return false
        return true
    }
    hasBody(obj: unknown) {
        if (!this.isTypedMessage(obj)) return false
        if (obj.type === 'empty') return false
        return true
    }
    compound(obj: TypedMessageCompound) {
        return (
            <div style={{ maxWidth: '95vw', overflow: 'break-word' }}>
                <ol>
                    {obj.items.map((x) => (
                        <li>{display(x)}</li>
                    ))}
                </ol>
            </div>
        )
    }
    fields(obj: TypedMessage) {
        return (
            <table>
                <tr style={{ background: 'rgba(255, 255, 255, 0.6)' }}>
                    <td style={{ minWidth: '4em' }}>Field</td>
                    <td>Value</td>
                </tr>
                {Object.keys(obj)
                    .filter((x) => x !== 'type' && x !== 'meta' && x !== 'version')
                    .map((x) => (
                        <tr>
                            <td>{x}</td>
                            {display((obj as any)[x])}
                        </tr>
                    ))}
            </table>
        )
    }
    text(obj: TypedMessageText) {
        return <code style={{ paddingLeft: '2em', opacity: 0.8 }}>{obj.content}</code>
    }
    image(obj: TypedMessageImage) {
        if (typeof obj.image === 'string')
            return <img src={obj.image} height={(obj.height || 600) / 10} width={(obj.width || 400) / 10} />
        return this.fields(obj)
    }
    body(obj: TypedMessage) {
        if (isTypedMessageCompound(obj)) return this.compound(obj)
        if (isTypedMessageText(obj)) return this.text(obj)
        if (isTypedMessageImage(obj)) return this.image(obj)
        return this.fields(obj)
    }
    header(obj: unknown) {
        if (!this.isTypedMessage(obj)) return null
        return (
            <div>
                TypedMessage({obj.type}) {(obj.meta?.size || 0) > 0 ? <>(with meta {display(obj.meta)})</> : ''}
            </div>
        )
    }
}
export function enhanceTypedMessageDebugger() {
    // TODO: this library does not support React new JSX transform yet.
    // React.installCustomObjectFormatter(new TypedMessageFormatter())
}
function display(obj: unknown) {
    switch (typeof obj) {
        case 'string':
            return obj
        default:
            // @ts-ignore
            return <object object={obj} />
    }
}
