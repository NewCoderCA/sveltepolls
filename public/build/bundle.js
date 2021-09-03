
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root.host) {
            return root;
        }
        return document;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Header.svelte generated by Svelte v3.42.3 */

    const file$9 = "src/components/Header.svelte";

    function create_fragment$9(ctx) {
    	let header;
    	let p;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			p = element("p");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/map.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Poll African continent map logo");
    			attr_dev(img, "class", "map svelte-14tn31a");
    			add_location(img, file$9, 4, 4, 37);
    			attr_dev(p, "class", "svelte-14tn31a");
    			add_location(p, file$9, 3, 1, 29);
    			attr_dev(header, "class", "svelte-14tn31a");
    			add_location(header, file$9, 2, 0, 19);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, p);
    			append_dev(p, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/components/AfricanCountry.svelte generated by Svelte v3.42.3 */

    const file$8 = "src/components/AfricanCountry.svelte";

    function create_fragment$8(ctx) {
    	let form;
    	let div0;
    	let label0;
    	let t1;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let option14;
    	let option15;
    	let option16;
    	let option17;
    	let option18;
    	let option19;
    	let option20;
    	let option21;
    	let option22;
    	let option23;
    	let option24;
    	let option25;
    	let option26;
    	let option27;
    	let option28;
    	let option29;
    	let option30;
    	let option31;
    	let option32;
    	let option33;
    	let option34;
    	let option35;
    	let option36;
    	let option37;
    	let option38;
    	let option39;
    	let option40;
    	let option41;
    	let option42;
    	let option43;
    	let option44;
    	let option45;
    	let option46;
    	let option47;
    	let option48;
    	let option49;
    	let option50;
    	let option51;
    	let option52;
    	let option53;
    	let t56;
    	let div1;
    	let label1;
    	let t58;
    	let textarea;
    	let t59;
    	let div2;
    	let label2;
    	let t61;
    	let select1;
    	let option54;
    	let option55;
    	let option56;
    	let option57;
    	let option58;
    	let option59;
    	let t68;
    	let div3;
    	let label3;
    	let t70;
    	let input0;
    	let t71;
    	let label4;
    	let t73;
    	let input1;
    	let t74;
    	let label5;
    	let t76;
    	let input2;
    	let t77;
    	let label6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Choose your African Country";
    			t1 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Select a country";
    			option1 = element("option");
    			option1.textContent = "Algeria";
    			option2 = element("option");
    			option2.textContent = "Angola";
    			option3 = element("option");
    			option3.textContent = "Benin";
    			option4 = element("option");
    			option4.textContent = "Botswana";
    			option5 = element("option");
    			option5.textContent = "Berkina Faso";
    			option6 = element("option");
    			option6.textContent = "Burundi";
    			option7 = element("option");
    			option7.textContent = "Capo Verde";
    			option8 = element("option");
    			option8.textContent = "Cameroon";
    			option9 = element("option");
    			option9.textContent = "Central African Republic";
    			option10 = element("option");
    			option10.textContent = "Chad";
    			option11 = element("option");
    			option11.textContent = "Comoros";
    			option12 = element("option");
    			option12.textContent = "Capo Verde";
    			option13 = element("option");
    			option13.textContent = "Congo, Democratic Republic of the";
    			option14 = element("option");
    			option14.textContent = "Congo, Republic of the";
    			option15 = element("option");
    			option15.textContent = "Cote d'Ivoire";
    			option16 = element("option");
    			option16.textContent = "Djibouti";
    			option17 = element("option");
    			option17.textContent = "Capo Verde";
    			option18 = element("option");
    			option18.textContent = "Egypt";
    			option19 = element("option");
    			option19.textContent = "Equatorial Guinea";
    			option20 = element("option");
    			option20.textContent = "Eritrea";
    			option21 = element("option");
    			option21.textContent = "Eswatini (formerly Swaziland)";
    			option22 = element("option");
    			option22.textContent = "Ethiopia";
    			option23 = element("option");
    			option23.textContent = "Gabon";
    			option24 = element("option");
    			option24.textContent = "Gambia";
    			option25 = element("option");
    			option25.textContent = "Ghana";
    			option26 = element("option");
    			option26.textContent = "Guinea-Bissau";
    			option27 = element("option");
    			option27.textContent = "Kenya";
    			option28 = element("option");
    			option28.textContent = "Lesotho";
    			option29 = element("option");
    			option29.textContent = "Liberia";
    			option30 = element("option");
    			option30.textContent = "Madagascar";
    			option31 = element("option");
    			option31.textContent = "Malawi";
    			option32 = element("option");
    			option32.textContent = "Mali";
    			option33 = element("option");
    			option33.textContent = "Mauritius";
    			option34 = element("option");
    			option34.textContent = "Morocco";
    			option35 = element("option");
    			option35.textContent = "Mozambique";
    			option36 = element("option");
    			option36.textContent = "Namibia";
    			option37 = element("option");
    			option37.textContent = "Niger";
    			option38 = element("option");
    			option38.textContent = "Nigeria";
    			option39 = element("option");
    			option39.textContent = "Rwanda";
    			option40 = element("option");
    			option40.textContent = "Sao tome and Principe";
    			option41 = element("option");
    			option41.textContent = "Senegal";
    			option42 = element("option");
    			option42.textContent = "Seychelles";
    			option43 = element("option");
    			option43.textContent = "Sierra Leone";
    			option44 = element("option");
    			option44.textContent = "Somalia";
    			option45 = element("option");
    			option45.textContent = "South Africa";
    			option46 = element("option");
    			option46.textContent = "South Sudan";
    			option47 = element("option");
    			option47.textContent = "Sudan";
    			option48 = element("option");
    			option48.textContent = "Tanzania";
    			option49 = element("option");
    			option49.textContent = "Togo";
    			option50 = element("option");
    			option50.textContent = "Tunisia";
    			option51 = element("option");
    			option51.textContent = "Uganda";
    			option52 = element("option");
    			option52.textContent = "Zambia";
    			option53 = element("option");
    			option53.textContent = "Zimbabwe";
    			t56 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Relocation countries 5 maximum";
    			t58 = space();
    			textarea = element("textarea");
    			t59 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Relocation region 3 maximum";
    			t61 = space();
    			select1 = element("select");
    			option54 = element("option");
    			option54.textContent = "Select a relocation region";
    			option55 = element("option");
    			option55.textContent = "North Africa";
    			option56 = element("option");
    			option56.textContent = "South Africa";
    			option57 = element("option");
    			option57.textContent = "Central";
    			option58 = element("option");
    			option58.textContent = "East Africa";
    			option59 = element("option");
    			option59.textContent = "West Africa";
    			t68 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Number of Polls taken";
    			t70 = space();
    			input0 = element("input");
    			t71 = space();
    			label4 = element("label");
    			label4.textContent = "0-2 times";
    			t73 = space();
    			input1 = element("input");
    			t74 = space();
    			label5 = element("label");
    			label5.textContent = "3-5 times";
    			t76 = space();
    			input2 = element("input");
    			t77 = space();
    			label6 = element("label");
    			label6.textContent = "5+";
    			attr_dev(label0, "for", "country");
    			attr_dev(label0, "class", "svelte-10zybxp");
    			add_location(label0, file$8, 13, 4, 149);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$8, 15, 8, 272);
    			option1.__value = "algeria";
    			option1.value = option1.__value;
    			add_location(option1, file$8, 16, 8, 323);
    			option2.__value = "angola";
    			option2.value = option2.__value;
    			add_location(option2, file$8, 17, 8, 372);
    			option3.__value = "benin";
    			option3.value = option3.__value;
    			add_location(option3, file$8, 18, 8, 419);
    			option4.__value = "botswana";
    			option4.value = option4.__value;
    			add_location(option4, file$8, 19, 8, 464);
    			option5.__value = "berkina faso";
    			option5.value = option5.__value;
    			add_location(option5, file$8, 20, 8, 515);
    			option6.__value = "burundi";
    			option6.value = option6.__value;
    			add_location(option6, file$8, 21, 8, 574);
    			option7.__value = "cabo verde";
    			option7.value = option7.__value;
    			add_location(option7, file$8, 22, 8, 623);
    			option8.__value = "cameroon";
    			option8.value = option8.__value;
    			add_location(option8, file$8, 23, 8, 678);
    			option9.__value = "central african republic";
    			option9.value = option9.__value;
    			add_location(option9, file$8, 24, 8, 729);
    			option10.__value = "chad";
    			option10.value = option10.__value;
    			add_location(option10, file$8, 25, 8, 812);
    			option11.__value = "comoros";
    			option11.value = option11.__value;
    			add_location(option11, file$8, 26, 8, 855);
    			option12.__value = "cabo verde";
    			option12.value = option12.__value;
    			add_location(option12, file$8, 27, 8, 904);
    			option13.__value = "congo democratic republic of the";
    			option13.value = option13.__value;
    			add_location(option13, file$8, 28, 8, 959);
    			option14.__value = "congo republic of the";
    			option14.value = option14.__value;
    			add_location(option14, file$8, 29, 8, 1059);
    			option15.__value = "cote d'ivoire";
    			option15.value = option15.__value;
    			add_location(option15, file$8, 30, 8, 1137);
    			option16.__value = "djibouti";
    			option16.value = option16.__value;
    			add_location(option16, file$8, 31, 8, 1198);
    			option17.__value = "cabo verde";
    			option17.value = option17.__value;
    			add_location(option17, file$8, 32, 8, 1249);
    			option18.__value = "egypt";
    			option18.value = option18.__value;
    			add_location(option18, file$8, 33, 8, 1304);
    			option19.__value = "equatorial guinea";
    			option19.value = option19.__value;
    			add_location(option19, file$8, 34, 8, 1349);
    			option20.__value = "eritrea";
    			option20.value = option20.__value;
    			add_location(option20, file$8, 35, 8, 1418);
    			option21.__value = "eswatini (formerly swaziland)";
    			option21.value = option21.__value;
    			add_location(option21, file$8, 36, 8, 1467);
    			option22.__value = "ethiopia";
    			option22.value = option22.__value;
    			add_location(option22, file$8, 37, 8, 1560);
    			option23.__value = "gabon";
    			option23.value = option23.__value;
    			add_location(option23, file$8, 38, 8, 1611);
    			option24.__value = "gambia";
    			option24.value = option24.__value;
    			add_location(option24, file$8, 39, 8, 1656);
    			option25.__value = "ghana";
    			option25.value = option25.__value;
    			add_location(option25, file$8, 40, 8, 1703);
    			option26.__value = "guinea-bissau";
    			option26.value = option26.__value;
    			add_location(option26, file$8, 41, 8, 1748);
    			option27.__value = "kenya";
    			option27.value = option27.__value;
    			add_location(option27, file$8, 42, 8, 1809);
    			option28.__value = "lesotho";
    			option28.value = option28.__value;
    			add_location(option28, file$8, 43, 8, 1854);
    			option29.__value = "liberia";
    			option29.value = option29.__value;
    			add_location(option29, file$8, 44, 8, 1903);
    			option30.__value = "madagascar";
    			option30.value = option30.__value;
    			add_location(option30, file$8, 45, 8, 1952);
    			option31.__value = "malawi";
    			option31.value = option31.__value;
    			add_location(option31, file$8, 46, 8, 2007);
    			option32.__value = "mali";
    			option32.value = option32.__value;
    			add_location(option32, file$8, 47, 8, 2054);
    			option33.__value = "mauritius";
    			option33.value = option33.__value;
    			add_location(option33, file$8, 48, 8, 2097);
    			option34.__value = "morocco";
    			option34.value = option34.__value;
    			add_location(option34, file$8, 49, 8, 2150);
    			option35.__value = "mozambique";
    			option35.value = option35.__value;
    			add_location(option35, file$8, 50, 8, 2199);
    			option36.__value = "namibia";
    			option36.value = option36.__value;
    			add_location(option36, file$8, 51, 8, 2254);
    			option37.__value = "niger";
    			option37.value = option37.__value;
    			add_location(option37, file$8, 52, 8, 2303);
    			option38.__value = "nigeria";
    			option38.value = option38.__value;
    			add_location(option38, file$8, 53, 8, 2348);
    			option39.__value = "rwanda";
    			option39.value = option39.__value;
    			add_location(option39, file$8, 54, 8, 2397);
    			option40.__value = "sao time and principe";
    			option40.value = option40.__value;
    			add_location(option40, file$8, 55, 8, 2444);
    			option41.__value = "senegal";
    			option41.value = option41.__value;
    			add_location(option41, file$8, 56, 8, 2521);
    			option42.__value = "seychelles";
    			option42.value = option42.__value;
    			add_location(option42, file$8, 57, 8, 2570);
    			option43.__value = "sierra leone";
    			option43.value = option43.__value;
    			add_location(option43, file$8, 58, 8, 2625);
    			option44.__value = "somalia";
    			option44.value = option44.__value;
    			add_location(option44, file$8, 59, 8, 2684);
    			option45.__value = "south africa";
    			option45.value = option45.__value;
    			add_location(option45, file$8, 60, 8, 2733);
    			option46.__value = "south sudan";
    			option46.value = option46.__value;
    			add_location(option46, file$8, 61, 8, 2792);
    			option47.__value = "sudan";
    			option47.value = option47.__value;
    			add_location(option47, file$8, 62, 8, 2849);
    			option48.__value = "tanzania";
    			option48.value = option48.__value;
    			add_location(option48, file$8, 63, 8, 2894);
    			option49.__value = "togo";
    			option49.value = option49.__value;
    			add_location(option49, file$8, 64, 8, 2945);
    			option50.__value = "tunisia";
    			option50.value = option50.__value;
    			add_location(option50, file$8, 65, 8, 2988);
    			option51.__value = "uganda";
    			option51.value = option51.__value;
    			add_location(option51, file$8, 66, 8, 3037);
    			option52.__value = "zambia";
    			option52.value = option52.__value;
    			add_location(option52, file$8, 67, 8, 3084);
    			option53.__value = "zimbabwe";
    			option53.value = option53.__value;
    			add_location(option53, file$8, 68, 8, 3131);
    			attr_dev(select0, "id", "country");
    			if (/*formValues*/ ctx[0].country === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[1].call(select0));
    			add_location(select0, file$8, 14, 4, 210);
    			add_location(div0, file$8, 12, 0, 139);
    			attr_dev(label1, "for", "relocation");
    			attr_dev(label1, "class", "svelte-10zybxp");
    			add_location(label1, file$8, 73, 4, 3206);
    			attr_dev(textarea, "id", "relocation");
    			attr_dev(textarea, "class", "svelte-10zybxp");
    			add_location(textarea, file$8, 74, 4, 3273);
    			add_location(div1, file$8, 72, 0, 3196);
    			attr_dev(label2, "for", "mulitRegion");
    			attr_dev(label2, "class", "svelte-10zybxp");
    			add_location(label2, file$8, 78, 4, 3362);
    			option54.__value = "";
    			option54.value = option54.__value;
    			add_location(option54, file$8, 80, 8, 3506);
    			option55.__value = "north africa";
    			option55.value = option55.__value;
    			add_location(option55, file$8, 81, 8, 3567);
    			option56.__value = "south africa";
    			option56.value = option56.__value;
    			add_location(option56, file$8, 82, 8, 3626);
    			option57.__value = "central";
    			option57.value = option57.__value;
    			add_location(option57, file$8, 83, 8, 3685);
    			option58.__value = "east africa";
    			option58.value = option58.__value;
    			add_location(option58, file$8, 84, 8, 3734);
    			option59.__value = "west africa";
    			option59.value = option59.__value;
    			add_location(option59, file$8, 85, 8, 3791);
    			attr_dev(select1, "id", "mulitRegion");
    			select1.multiple = true;
    			if (/*formValues*/ ctx[0].multiRegion === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[3].call(select1));
    			add_location(select1, file$8, 79, 4, 3427);
    			add_location(div2, file$8, 77, 0, 3352);
    			attr_dev(label3, "class", "svelte-10zybxp");
    			add_location(label3, file$8, 90, 4, 3872);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "id", "0-2");
    			input0.__value = "0-2";
    			input0.value = input0.__value;
    			attr_dev(input0, "class", "svelte-10zybxp");
    			/*$$binding_groups*/ ctx[5][0].push(input0);
    			add_location(input0, file$8, 91, 4, 3913);
    			attr_dev(label4, "for", "0-2");
    			attr_dev(label4, "class", "svelte-10zybxp");
    			add_location(label4, file$8, 92, 4, 3999);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "id", "3-5");
    			input1.__value = "3-5";
    			input1.value = input1.__value;
    			attr_dev(input1, "class", "svelte-10zybxp");
    			/*$$binding_groups*/ ctx[5][0].push(input1);
    			add_location(input1, file$8, 93, 4, 4038);
    			attr_dev(label5, "for", "3-5");
    			attr_dev(label5, "class", "svelte-10zybxp");
    			add_location(label5, file$8, 94, 4, 4124);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "id", "5+");
    			input2.__value = "5+";
    			input2.value = input2.__value;
    			attr_dev(input2, "class", "svelte-10zybxp");
    			/*$$binding_groups*/ ctx[5][0].push(input2);
    			add_location(input2, file$8, 95, 4, 4163);
    			attr_dev(label6, "for", "5+");
    			attr_dev(label6, "class", "svelte-10zybxp");
    			add_location(label6, file$8, 96, 4, 4247);
    			add_location(div3, file$8, 89, 0, 3862);
    			attr_dev(form, "class", "svelte-10zybxp");
    			add_location(form, file$8, 11, 0, 132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(select0, option3);
    			append_dev(select0, option4);
    			append_dev(select0, option5);
    			append_dev(select0, option6);
    			append_dev(select0, option7);
    			append_dev(select0, option8);
    			append_dev(select0, option9);
    			append_dev(select0, option10);
    			append_dev(select0, option11);
    			append_dev(select0, option12);
    			append_dev(select0, option13);
    			append_dev(select0, option14);
    			append_dev(select0, option15);
    			append_dev(select0, option16);
    			append_dev(select0, option17);
    			append_dev(select0, option18);
    			append_dev(select0, option19);
    			append_dev(select0, option20);
    			append_dev(select0, option21);
    			append_dev(select0, option22);
    			append_dev(select0, option23);
    			append_dev(select0, option24);
    			append_dev(select0, option25);
    			append_dev(select0, option26);
    			append_dev(select0, option27);
    			append_dev(select0, option28);
    			append_dev(select0, option29);
    			append_dev(select0, option30);
    			append_dev(select0, option31);
    			append_dev(select0, option32);
    			append_dev(select0, option33);
    			append_dev(select0, option34);
    			append_dev(select0, option35);
    			append_dev(select0, option36);
    			append_dev(select0, option37);
    			append_dev(select0, option38);
    			append_dev(select0, option39);
    			append_dev(select0, option40);
    			append_dev(select0, option41);
    			append_dev(select0, option42);
    			append_dev(select0, option43);
    			append_dev(select0, option44);
    			append_dev(select0, option45);
    			append_dev(select0, option46);
    			append_dev(select0, option47);
    			append_dev(select0, option48);
    			append_dev(select0, option49);
    			append_dev(select0, option50);
    			append_dev(select0, option51);
    			append_dev(select0, option52);
    			append_dev(select0, option53);
    			select_option(select0, /*formValues*/ ctx[0].country);
    			append_dev(form, t56);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t58);
    			append_dev(div1, textarea);
    			set_input_value(textarea, /*formValues*/ ctx[0].relocationSummary);
    			append_dev(form, t59);
    			append_dev(form, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t61);
    			append_dev(div2, select1);
    			append_dev(select1, option54);
    			append_dev(select1, option55);
    			append_dev(select1, option56);
    			append_dev(select1, option57);
    			append_dev(select1, option58);
    			append_dev(select1, option59);
    			select_options(select1, /*formValues*/ ctx[0].multiRegion);
    			append_dev(form, t68);
    			append_dev(form, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t70);
    			append_dev(div3, input0);
    			input0.checked = input0.__value === /*formValues*/ ctx[0].numberofPolls;
    			append_dev(div3, t71);
    			append_dev(div3, label4);
    			append_dev(div3, t73);
    			append_dev(div3, input1);
    			input1.checked = input1.__value === /*formValues*/ ctx[0].numberofPolls;
    			append_dev(div3, t74);
    			append_dev(div3, label5);
    			append_dev(div3, t76);
    			append_dev(div3, input2);
    			input2.checked = input2.__value === /*formValues*/ ctx[0].numberofPolls;
    			append_dev(div3, t77);
    			append_dev(div3, label6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[1]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[2]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[3]),
    					listen_dev(input0, "change", /*input0_change_handler*/ ctx[4]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[6]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*formValues*/ 1) {
    				select_option(select0, /*formValues*/ ctx[0].country);
    			}

    			if (dirty & /*formValues*/ 1) {
    				set_input_value(textarea, /*formValues*/ ctx[0].relocationSummary);
    			}

    			if (dirty & /*formValues*/ 1) {
    				select_options(select1, /*formValues*/ ctx[0].multiRegion);
    			}

    			if (dirty & /*formValues*/ 1) {
    				input0.checked = input0.__value === /*formValues*/ ctx[0].numberofPolls;
    			}

    			if (dirty & /*formValues*/ 1) {
    				input1.checked = input1.__value === /*formValues*/ ctx[0].numberofPolls;
    			}

    			if (dirty & /*formValues*/ 1) {
    				input2.checked = input2.__value === /*formValues*/ ctx[0].numberofPolls;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input1), 1);
    			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input2), 1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AfricanCountry', slots, []);

    	const formValues = {
    		country: '',
    		relocationSummary: '',
    		multiRegion: [],
    		numberofPolls: []
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AfricanCountry> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function select0_change_handler() {
    		formValues.country = select_value(this);
    		$$invalidate(0, formValues);
    	}

    	function textarea_input_handler() {
    		formValues.relocationSummary = this.value;
    		$$invalidate(0, formValues);
    	}

    	function select1_change_handler() {
    		formValues.multiRegion = select_multiple_value(this);
    		$$invalidate(0, formValues);
    	}

    	function input0_change_handler() {
    		formValues.numberofPolls = this.__value;
    		$$invalidate(0, formValues);
    	}

    	function input1_change_handler() {
    		formValues.numberofPolls = this.__value;
    		$$invalidate(0, formValues);
    	}

    	function input2_change_handler() {
    		formValues.numberofPolls = this.__value;
    		$$invalidate(0, formValues);
    	}

    	$$self.$capture_state = () => ({ formValues });

    	return [
    		formValues,
    		select0_change_handler,
    		textarea_input_handler,
    		select1_change_handler,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler,
    		input2_change_handler
    	];
    }

    class AfricanCountry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AfricanCountry",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.42.3 */

    const file$7 = "src/components/Footer.svelte";

    function create_fragment$7(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "Copyright 2021 Polls for Africa";
    			attr_dev(div, "class", "copyright svelte-1wk94m5");
    			add_location(div, file$7, 1, 4, 13);
    			attr_dev(footer, "class", "svelte-1wk94m5");
    			add_location(footer, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const PollStore = writable([
        {
    		id: 1,
    		question: 'Mountain or River',
    		answerA: 'Mountain',
    		answerB: 'River',
    		votesA: 9,
    		votesB: 15,
    	},
        {
    		id: 2,
    		question: 'Nollywood or Holloywood movies',
    		answerA: 'Nollywood',
    		answerB: 'Hollywood',
    		votesA: 58,
    		votesB: 42,
    	},
    	{
    		id: 3,
    		question: 'Jellof rice or Rice and peas',
    		answerA: 'Jellof',
    		answerB: 'Rice and peas',
    		votesA: 29,
    		votesB: 8,
    	},
    ]);

    /* src/shared/Card.svelte generated by Svelte v3.42.3 */

    const file$6 = "src/shared/Card.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-13qm1bg");
    			add_location(div, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/shared/Button.svelte generated by Svelte v3.42.3 */

    const file$5 = "src/shared/Button.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let t0;
    	let p;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			p = element("p");
    			p.textContent = "Passing any data as content through the slot to the component via this button";
    			attr_dev(p, "class", "svelte-1d7vz1c");
    			add_location(p, file$5, 9, 4, 198);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-1d7vz1c"));
    			toggle_class(button, "flat", /*flat*/ ctx[1]);
    			toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			add_location(button, file$5, 7, 0, 103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			append_dev(button, t0);
    			append_dev(button, p);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-1d7vz1c"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*type, flat*/ 3) {
    				toggle_class(button, "flat", /*flat*/ ctx[1]);
    			}

    			if (dirty & /*type, inverse*/ 5) {
    				toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { type = 'primary' } = $$props;
    	let { flat = false } = $$props;
    	let { inverse = false } = $$props;
    	const writable_props = ['type', 'flat', 'inverse'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, flat, inverse });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, flat, inverse, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { type: 0, flat: 1, inverse: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src/components/PollDetails.svelte generated by Svelte v3.42.3 */
    const file$4 = "src/components/PollDetails.svelte";

    // (67:8) <Button flat={true} on:click={() => handleDelete(poll.id)}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Delete");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(67:8) <Button flat={true} on:click={() => handleDelete(poll.id)}>",
    		ctx
    	});

    	return block;
    }

    // (53:0) <Card>
    function create_default_slot$1(ctx) {
    	let div5;
    	let h2;
    	let t0_value = /*poll*/ ctx[0].question + "";
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let t4;
    	let div1;
    	let div0;
    	let t5;
    	let span0;
    	let t6_value = /*poll*/ ctx[0].answerA + "";
    	let t6;
    	let t7;
    	let t8_value = /*poll*/ ctx[0].votesA + "";
    	let t8;
    	let t9;
    	let t10;
    	let div3;
    	let div2;
    	let t11;
    	let span1;
    	let t12_value = /*poll*/ ctx[0].answerB + "";
    	let t12;
    	let t13;
    	let t14_value = /*poll*/ ctx[0].votesB + "";
    	let t14;
    	let t15;
    	let t16;
    	let div4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				flat: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_2*/ ctx[12]);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text("Total votes: ");
    			t3 = text(/*totalVotes*/ ctx[1]);
    			t4 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t5 = space();
    			span0 = element("span");
    			t6 = text(t6_value);
    			t7 = text(" (");
    			t8 = text(t8_value);
    			t9 = text(")");
    			t10 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t11 = space();
    			span1 = element("span");
    			t12 = text(t12_value);
    			t13 = text(" (");
    			t14 = text(t14_value);
    			t15 = text(")");
    			t16 = space();
    			div4 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(h2, "class", "svelte-9hefd");
    			add_location(h2, file$4, 54, 4, 1331);
    			attr_dev(h3, "class", "svelte-9hefd");
    			add_location(h3, file$4, 55, 4, 1362);
    			attr_dev(div0, "class", "percent percent-a svelte-9hefd");
    			set_style(div0, "width", /*$tweenA*/ ctx[2] + "%");
    			add_location(div0, file$4, 57, 8, 1474);
    			attr_dev(span0, "class", "svelte-9hefd");
    			add_location(span0, file$4, 58, 8, 1546);
    			attr_dev(div1, "class", "answer svelte-9hefd");
    			add_location(div1, file$4, 56, 4, 1403);
    			attr_dev(div2, "class", "percent percent-b svelte-9hefd");
    			set_style(div2, "width", /*$tweenB*/ ctx[3] + "%");
    			add_location(div2, file$4, 61, 8, 1680);
    			attr_dev(span1, "class", "svelte-9hefd");
    			add_location(span1, file$4, 63, 8, 1822);
    			attr_dev(div3, "class", "answer svelte-9hefd");
    			add_location(div3, file$4, 60, 4, 1609);
    			attr_dev(div4, "class", "delete svelte-9hefd");
    			add_location(div4, file$4, 65, 4, 1885);
    			attr_dev(div5, "class", "poll");
    			add_location(div5, file$4, 53, 4, 1308);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h2);
    			append_dev(h2, t0);
    			append_dev(div5, t1);
    			append_dev(div5, h3);
    			append_dev(h3, t2);
    			append_dev(h3, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t5);
    			append_dev(div1, span0);
    			append_dev(span0, t6);
    			append_dev(span0, t7);
    			append_dev(span0, t8);
    			append_dev(span0, t9);
    			append_dev(div5, t10);
    			append_dev(div5, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t11);
    			append_dev(div3, span1);
    			append_dev(span1, t12);
    			append_dev(span1, t13);
    			append_dev(span1, t14);
    			append_dev(span1, t15);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			mount_component(button, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(div3, "click", /*click_handler_1*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*poll*/ 1) && t0_value !== (t0_value = /*poll*/ ctx[0].question + "")) set_data_dev(t0, t0_value);
    			if (!current || dirty & /*totalVotes*/ 2) set_data_dev(t3, /*totalVotes*/ ctx[1]);

    			if (!current || dirty & /*$tweenA*/ 4) {
    				set_style(div0, "width", /*$tweenA*/ ctx[2] + "%");
    			}

    			if ((!current || dirty & /*poll*/ 1) && t6_value !== (t6_value = /*poll*/ ctx[0].answerA + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*poll*/ 1) && t8_value !== (t8_value = /*poll*/ ctx[0].votesA + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty & /*$tweenB*/ 8) {
    				set_style(div2, "width", /*$tweenB*/ ctx[3] + "%");
    			}

    			if ((!current || dirty & /*poll*/ 1) && t12_value !== (t12_value = /*poll*/ ctx[0].answerB + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*poll*/ 1) && t14_value !== (t14_value = /*poll*/ ctx[0].votesB + "")) set_data_dev(t14, t14_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(53:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, poll, $tweenB, $tweenA, totalVotes*/ 8207) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let totalVotes;
    	let percentA;
    	let percentB;
    	let $tweenA;
    	let $tweenB;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PollDetails', slots, []);
    	let { poll } = $$props;

    	//Tween-change over time the percentage value on poll bar
    	const tweenA = tweened(0);

    	validate_store(tweenA, 'tweenA');
    	component_subscribe($$self, tweenA, value => $$invalidate(2, $tweenA = value));
    	const tweenB = tweened(0);
    	validate_store(tweenB, 'tweenB');
    	component_subscribe($$self, tweenB, value => $$invalidate(3, $tweenB = value));

    	//Handling Votes 
    	const handleVote = (option, id) => {
    		//Create update function on the Store
    		PollStore.update(currentPolls => {
    			let copiedPolls = [...currentPolls];
    			let upvotedPoll = copiedPolls.find(poll => poll.id == id);

    			//Check which option to update
    			if (option === 'a') {
    				upvotedPoll.votesA++;
    			}

    			if (option === 'b') {
    				upvotedPoll.votesB++;
    			}

    			return copiedPolls;
    		});
    	};

    	//Deleting Poll
    	const handleDelete = id => {
    		PollStore.update(currentPolls => {
    			return currentPolls.filter(poll => poll.id != id); //Returns filtered array minus correct id
    		});
    	};

    	const writable_props = ['poll'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PollDetails> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleVote('a', poll.id);
    	const click_handler_1 = () => handleVote('b', poll.id);
    	const click_handler_2 = () => handleDelete(poll.id);

    	$$self.$$set = $$props => {
    		if ('poll' in $$props) $$invalidate(0, poll = $$props.poll);
    	};

    	$$self.$capture_state = () => ({
    		Card,
    		PollStore,
    		Button,
    		tweened,
    		poll,
    		tweenA,
    		tweenB,
    		handleVote,
    		handleDelete,
    		percentB,
    		percentA,
    		totalVotes,
    		$tweenA,
    		$tweenB
    	});

    	$$self.$inject_state = $$props => {
    		if ('poll' in $$props) $$invalidate(0, poll = $$props.poll);
    		if ('percentB' in $$props) $$invalidate(8, percentB = $$props.percentB);
    		if ('percentA' in $$props) $$invalidate(9, percentA = $$props.percentA);
    		if ('totalVotes' in $$props) $$invalidate(1, totalVotes = $$props.totalVotes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*poll*/ 1) {
    			//Reactive values for totals
    			$$invalidate(1, totalVotes = poll.votesA + poll.votesB);
    		}

    		if ($$self.$$.dirty & /*totalVotes, poll*/ 3) {
    			//Reactive poll vote moving percentages
    			$$invalidate(9, percentA = Math.floor(100 / totalVotes * poll.votesA) || 0);
    		}

    		if ($$self.$$.dirty & /*totalVotes, poll*/ 3) {
    			$$invalidate(8, percentB = Math.floor(100 / totalVotes * poll.votesB) || 0);
    		}

    		if ($$self.$$.dirty & /*percentA*/ 512) {
    			//Reactive value of poll bar will run when percentA changes 
    			tweenA.set(percentA);
    		}

    		if ($$self.$$.dirty & /*percentB*/ 256) {
    			tweenB.set(percentB);
    		}
    	};

    	return [
    		poll,
    		totalVotes,
    		$tweenA,
    		$tweenB,
    		tweenA,
    		tweenB,
    		handleVote,
    		handleDelete,
    		percentB,
    		percentA,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class PollDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { poll: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PollDetails",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*poll*/ ctx[0] === undefined && !('poll' in props)) {
    			console.warn("<PollDetails> was created without expected prop 'poll'");
    		}
    	}

    	get poll() {
    		throw new Error("<PollDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set poll(value) {
    		throw new Error("<PollDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PollList.svelte generated by Svelte v3.42.3 */
    const file$3 = "src/components/PollList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (10:2) {#each $PollStore as poll (poll.id)}
    function create_each_block$1(key_1, ctx) {
    	let button;
    	let polldetails;
    	let t;
    	let button_intro;
    	let button_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	polldetails = new PollDetails({
    			props: { poll: /*poll*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			button = element("button");
    			create_component(polldetails.$$.fragment);
    			t = space();
    			attr_dev(button, "class", "svelte-1udq0i0");
    			add_location(button, file$3, 10, 2, 278);
    			this.first = button;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(polldetails, button, null);
    			append_dev(button, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const polldetails_changes = {};
    			if (dirty & /*$PollStore*/ 1) polldetails_changes.poll = /*poll*/ ctx[1];
    			polldetails.$set(polldetails_changes);
    		},
    		r: function measure() {
    			rect = button.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(button);
    			stop_animation();
    			add_transform(button, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(button, rect, flip, { duration: 500 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polldetails.$$.fragment, local);

    			add_render_callback(() => {
    				if (button_outro) button_outro.end(1);
    				button_intro = create_in_transition(button, fade, {});
    				button_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polldetails.$$.fragment, local);
    			if (button_intro) button_intro.invalidate();

    			if (local) {
    				button_outro = create_out_transition(button, slide, {});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(polldetails);
    			if (detaching && button_outro) button_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(10:2) {#each $PollStore as poll (poll.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$PollStore*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*poll*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "poll-list svelte-1udq0i0");
    			add_location(div, file$3, 8, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$PollStore*/ 1) {
    				each_value = /*$PollStore*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $PollStore;
    	validate_store(PollStore, 'PollStore');
    	component_subscribe($$self, PollStore, $$value => $$invalidate(0, $PollStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PollList', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PollList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		slide,
    		scale,
    		flip,
    		PollStore,
    		PollDetails,
    		$PollStore
    	});

    	return [$PollStore];
    }

    class PollList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PollList",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/CreatePollForm.svelte generated by Svelte v3.42.3 */
    const file$2 = "src/components/CreatePollForm.svelte";

    // (64:4) <Button type="secondary" flat={true}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Add Poll");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(64:4) <Button type=\\\"secondary\\\" flat={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let form;
    	let div1;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div0;
    	let t3_value = /*errors*/ ctx[1].question + "";
    	let t3;
    	let t4;
    	let div3;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div2;
    	let t8_value = /*errors*/ ctx[1].answerA + "";
    	let t8;
    	let t9;
    	let div5;
    	let label2;
    	let t11;
    	let input2;
    	let t12;
    	let div4;
    	let t13_value = /*errors*/ ctx[1].answerB + "";
    	let t13;
    	let t14;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				type: "secondary",
    				flat: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Poll Question:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div0 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Answer A:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			div5 = element("div");
    			label2 = element("label");
    			label2.textContent = "Answer B:";
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			div4 = element("div");
    			t13 = text(t13_value);
    			t14 = space();
    			create_component(button.$$.fragment);
    			attr_dev(label0, "for", "question");
    			attr_dev(label0, "class", "svelte-1g0zfcq");
    			add_location(label0, file$2, 49, 8, 1387);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "question");
    			attr_dev(input0, "class", "svelte-1g0zfcq");
    			add_location(input0, file$2, 50, 8, 1440);
    			attr_dev(div0, "class", "errors svelte-1g0zfcq");
    			add_location(div0, file$2, 51, 8, 1511);
    			attr_dev(div1, "class", "form-field svelte-1g0zfcq");
    			add_location(div1, file$2, 48, 4, 1354);
    			attr_dev(label1, "for", "answer-a");
    			attr_dev(label1, "class", "svelte-1g0zfcq");
    			add_location(label1, file$2, 54, 8, 1605);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "answer-a");
    			attr_dev(input1, "class", "svelte-1g0zfcq");
    			add_location(input1, file$2, 55, 8, 1653);
    			attr_dev(div2, "class", "errors svelte-1g0zfcq");
    			add_location(div2, file$2, 56, 8, 1723);
    			attr_dev(div3, "class", "form-field svelte-1g0zfcq");
    			add_location(div3, file$2, 53, 4, 1572);
    			attr_dev(label2, "for", "answer-b");
    			attr_dev(label2, "class", "svelte-1g0zfcq");
    			add_location(label2, file$2, 59, 8, 1816);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "answer-b");
    			attr_dev(input2, "class", "svelte-1g0zfcq");
    			add_location(input2, file$2, 60, 8, 1864);
    			attr_dev(div4, "class", "errors svelte-1g0zfcq");
    			add_location(div4, file$2, 61, 8, 1934);
    			attr_dev(div5, "class", "form-field svelte-1g0zfcq");
    			add_location(div5, file$2, 58, 4, 1783);
    			attr_dev(form, "class", "svelte-1g0zfcq");
    			add_location(form, file$2, 47, 0, 1301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*fields*/ ctx[0].question);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, t3);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t6);
    			append_dev(div3, input1);
    			set_input_value(input1, /*fields*/ ctx[0].answerA);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, t8);
    			append_dev(form, t9);
    			append_dev(form, div5);
    			append_dev(div5, label2);
    			append_dev(div5, t11);
    			append_dev(div5, input2);
    			set_input_value(input2, /*fields*/ ctx[0].answerB);
    			append_dev(div5, t12);
    			append_dev(div5, div4);
    			append_dev(div4, t13);
    			append_dev(form, t14);
    			mount_component(button, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*submmitHandler*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fields*/ 1 && input0.value !== /*fields*/ ctx[0].question) {
    				set_input_value(input0, /*fields*/ ctx[0].question);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t3_value !== (t3_value = /*errors*/ ctx[1].question + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*fields*/ 1 && input1.value !== /*fields*/ ctx[0].answerA) {
    				set_input_value(input1, /*fields*/ ctx[0].answerA);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t8_value !== (t8_value = /*errors*/ ctx[1].answerA + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*fields*/ 1 && input2.value !== /*fields*/ ctx[0].answerB) {
    				set_input_value(input2, /*fields*/ ctx[0].answerB);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t13_value !== (t13_value = /*errors*/ ctx[1].answerB + "")) set_data_dev(t13, t13_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreatePollForm', slots, []);
    	let dispatch = createEventDispatcher();
    	let fields = { question: '', answerA: '', answerB: '' };
    	let errors = { question: '', answerA: '', answerB: '' };
    	let valid = false;

    	const submmitHandler = () => {
    		valid = true;

    		//Form is true at beginning if any answers fail form is false
    		if (fields.question.trim().length < 2) {
    			valid = false;
    			$$invalidate(1, errors.question = 'Question must be at least 2 characters long', errors);
    		} else {
    			$$invalidate(1, errors.question = '', errors);
    		}

    		//Validate AnswerA
    		if (fields.answerA.trim().length < 1) {
    			valid = false;
    			$$invalidate(1, errors.answerA = 'Answer A cannot be empty', errors);
    		} else {
    			$$invalidate(1, errors.answerA = '', errors);
    		}

    		//Validate AnswerB
    		if (fields.answerB.trim().length < 1) {
    			valid = false;
    			$$invalidate(1, errors.answerB = 'Answer B cannot be empty', errors);
    		} else {
    			$$invalidate(1, errors.answerB = '', errors);
    		}

    		//Add New Poll if Valid is True
    		if (valid) {
    			let poll = {
    				...fields,
    				votesA: 0,
    				votesB: 0,
    				id: Math.random()
    			};

    			//Line below saves poll direct to Store using callback function update
    			PollStore.update(currentPolls => {
    				return [poll, ...currentPolls]; //Return new poll and copy of all currentPolls
    			});

    			dispatch('add');
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreatePollForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		fields.question = this.value;
    		$$invalidate(0, fields);
    	}

    	function input1_input_handler() {
    		fields.answerA = this.value;
    		$$invalidate(0, fields);
    	}

    	function input2_input_handler() {
    		fields.answerB = this.value;
    		$$invalidate(0, fields);
    	}

    	$$self.$capture_state = () => ({
    		PollStore,
    		createEventDispatcher,
    		Button,
    		dispatch,
    		fields,
    		errors,
    		valid,
    		submmitHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('fields' in $$props) $$invalidate(0, fields = $$props.fields);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    		if ('valid' in $$props) valid = $$props.valid;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fields,
    		errors,
    		submmitHandler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class CreatePollForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreatePollForm",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/shared/Tabs.svelte generated by Svelte v3.42.3 */
    const file$1 = "src/shared/Tabs.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (11:6) {#each items as item}
    function create_each_block(ctx) {
    	let li;
    	let div;
    	let t0_value = /*item*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*item*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "svelte-9set57");
    			toggle_class(div, "active", /*item*/ ctx[4] === /*activeItem*/ ctx[1]);
    			add_location(div, file$1, 12, 8, 270);
    			attr_dev(li, "class", "svelte-9set57");
    			add_location(li, file$1, 11, 6, 212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[4] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*items, activeItem*/ 3) {
    				toggle_class(div, "active", /*item*/ ctx[4] === /*activeItem*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:6) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let ul;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-9set57");
    			add_location(ul, file$1, 9, 2, 173);
    			attr_dev(div, "class", "tabs svelte-9set57");
    			add_location(div, file$1, 8, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatch, items, activeItem*/ 7) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	const dispatch = createEventDispatcher();
    	let { items } = $$props;
    	let { activeItem } = $$props;
    	const writable_props = ['items', 'activeItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => dispatch('tabChange', item);

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		items,
    		activeItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items, activeItem, dispatch, click_handler];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { items: 0, activeItem: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !('items' in props)) {
    			console.warn("<Tabs> was created without expected prop 'items'");
    		}

    		if (/*activeItem*/ ctx[1] === undefined && !('activeItem' in props)) {
    			console.warn("<Tabs> was created without expected prop 'activeItem'");
    		}
    	}

    	get items() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItem() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItem(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.3 */
    const file = "src/App.svelte";

    // (52:41) 
    function create_if_block_1(ctx) {
    	let createpollform;
    	let current;
    	createpollform = new CreatePollForm({ $$inline: true });
    	createpollform.$on("add", /*handleAdd*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(createpollform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(createpollform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(createpollform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(createpollform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(createpollform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(52:41) ",
    		ctx
    	});

    	return block;
    }

    // (50:1) {#if activeItem === 'Current Polls'}
    function create_if_block(ctx) {
    	let polllist;
    	let current;
    	polllist = new PollList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(polllist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(polllist, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polllist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polllist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(polllist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(50:1) {#if activeItem === 'Current Polls'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let h1;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let div;
    	let t8;
    	let input0;
    	let t9;
    	let input1;
    	let t10;
    	let africancountry;
    	let t11;
    	let tabs;
    	let t12;
    	let current_block_type_index;
    	let if_block;
    	let t13;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	africancountry = new AfricanCountry({ $$inline: true });

    	tabs = new Tabs({
    			props: {
    				activeItem: /*activeItem*/ ctx[3],
    				items: /*items*/ ctx[5]
    			},
    			$$inline: true
    		});

    	tabs.$on("tabChange", /*tabChange*/ ctx[6]);
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeItem*/ ctx[3] === 'Current Polls') return 0;
    		if (/*activeItem*/ ctx[3] === 'Add New Poll') return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			h1 = element("h1");
    			t1 = text("Hello ");
    			t2 = text(/*username*/ ctx[4]);
    			t3 = text(" welcome to ");
    			t4 = text(/*name*/ ctx[0]);
    			t5 = text(" Polls!");
    			t6 = space();
    			div = element("div");
    			div.textContent = "Insert your full name";
    			t8 = space();
    			input0 = element("input");
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			create_component(africancountry.$$.fragment);
    			t11 = space();
    			create_component(tabs.$$.fragment);
    			t12 = space();
    			if (if_block) if_block.c();
    			t13 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h1, "class", "svelte-1ugy53g");
    			add_location(h1, file, 40, 1, 973);
    			add_location(div, file, 41, 1, 1025);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-1ugy53g");
    			add_location(input0, file, 44, 4, 1229);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "svelte-1ugy53g");
    			add_location(input1, file, 45, 1, 1273);
    			attr_dev(main, "class", "svelte-1ugy53g");
    			add_location(main, file, 39, 0, 965);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			append_dev(main, t6);
    			append_dev(main, div);
    			append_dev(main, t8);
    			append_dev(main, input0);
    			set_input_value(input0, /*firstName*/ ctx[1]);
    			append_dev(main, t9);
    			append_dev(main, input1);
    			set_input_value(input1, /*lastName*/ ctx[2]);
    			append_dev(main, t10);
    			mount_component(africancountry, main, null);
    			append_dev(main, t11);
    			mount_component(tabs, main, null);
    			append_dev(main, t12);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			insert_dev(target, t13, anchor);
    			mount_component(footer, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "change", /*handleChange*/ ctx[8], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*username*/ 16) set_data_dev(t2, /*username*/ ctx[4]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t4, /*name*/ ctx[0]);

    			if (dirty & /*firstName*/ 2 && input0.value !== /*firstName*/ ctx[1]) {
    				set_input_value(input0, /*firstName*/ ctx[1]);
    			}

    			if (dirty & /*lastName*/ 4 && input1.value !== /*lastName*/ ctx[2]) {
    				set_input_value(input1, /*lastName*/ ctx[2]);
    			}

    			const tabs_changes = {};
    			if (dirty & /*activeItem*/ 8) tabs_changes.activeItem = /*activeItem*/ ctx[3];
    			tabs.$set(tabs_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(africancountry.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(africancountry.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(africancountry);
    			destroy_component(tabs);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t13);
    			destroy_component(footer, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let username;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;

    	//Tabs 
    	let items = ['Current Polls', 'Add New Poll'];

    	let activeItem = 'Current Polls';

    	const tabChange = e => {
    		$$invalidate(3, activeItem = e.detail); //e.detail is the item we send along in the <li tag>
    	};

    	//Polls now in writeable PollStore file
    	const handleAdd = e => {
    		$$invalidate(3, activeItem = 'Current Polls'); //Only need to add active data to the Store
    	};

    	//Users name will appear in title
    	let firstName = '';

    	let lastName = '';

    	const handleChange = () => {
    		$$invalidate(4, username = '');
    	};

    	const handleInput = e => {
    		$$invalidate(4, username = e.target.value);
    	};

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		firstName = this.value;
    		$$invalidate(1, firstName);
    	}

    	function input1_input_handler() {
    		lastName = this.value;
    		$$invalidate(2, lastName);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		Header,
    		AfricanCountry,
    		Footer,
    		PollList,
    		CreatePollForm,
    		Tabs,
    		items,
    		activeItem,
    		tabChange,
    		handleAdd,
    		firstName,
    		lastName,
    		handleChange,
    		handleInput,
    		username
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('items' in $$props) $$invalidate(5, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(3, activeItem = $$props.activeItem);
    		if ('firstName' in $$props) $$invalidate(1, firstName = $$props.firstName);
    		if ('lastName' in $$props) $$invalidate(2, lastName = $$props.lastName);
    		if ('username' in $$props) $$invalidate(4, username = $$props.username);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*firstName, lastName*/ 6) {
    			$$invalidate(4, username = `${firstName} ${lastName}`);
    		}
    	};

    	return [
    		name,
    		firstName,
    		lastName,
    		activeItem,
    		username,
    		items,
    		tabChange,
    		handleAdd,
    		handleChange,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Africa'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
