import { NestedSetProperties } from './nested-set-properties';

export class NestedSetNode implements NestedSetProperties {
  public depth: number;
  public left: number;
  public right: number;
  public title: string;
  public detail: { name: string; age: number; username: string };

  public children: NestedSetNode[];
  public parent: NestedSetNode | null;

  constructor(
    title: string = '',
    depth: number = 0,
    detail: { name: string; age: number; username: string } = { name: '', age: 0, username: '' },
    parent?: NestedSetNode
  ) {
    this.title = title;
    this.depth = depth;
    this.left = 0; // Initialize as 0; will be updated by rebuild
    this.right = 1; // Initialize as 1; will be updated by rebuild
    this.detail = detail;
    this.children = [];

    if (parent) {
      parent.append(this);
    } else {
      this.parent = null;
    }
  }

  public toJSON() {
    return {
      title: this.title,
      left: this.left,
      right: this.right,
      depth: this.depth,
      detail: this.detail,
      children: this.children.map((child) => child.toJSON())
    };
  }

  public isLeaf(): boolean {
    return this.depth > 0 && this.children.length === 0;
  }

  public isRoot(): boolean {
    return !this.parent;
  }

  public prevSibling(): NestedSetNode | null {
    if (this.parent) {
      let idx = this.parent.children.indexOf(this);
      return typeof this.parent.children[idx - 1] !== 'undefined' ? this.parent.children[idx - 1] : null;
    } else {
      return null;
    }
  }

  public nextSibling(): NestedSetNode | null {
    if (this.parent) {
      let idx = this.parent.children.indexOf(this);
      return typeof this.parent.children[idx + 1] !== 'undefined' ? this.parent.children[idx + 1] : null;
    } else {
      return null;
    }
  }

  public countNextSiblings(): number {
    if (this.parent) {
      return this.parent.children.length - (this.parent.children.indexOf(this) + 1);
    } else {
      return 0;
    }
  }

  public getSize(): number {
    if (this.isLeaf()) {
      return 2;
    } else {
      let childrenSize = 0;
      this.children.forEach((child: NestedSetNode) => {
        childrenSize = childrenSize + child.getSize();
      });
      return 2 + childrenSize;
    }
  }

  public append(node: NestedSetNode) {
    node.parent = this;
    node.depth = this.depth + 1;
    this.children.push(node);
    this.rebuild();
  }

  public prepend(node: NestedSetNode) {
    node.parent = this;
    node.depth = this.depth + 1;
    this.children.unshift(node);
    this.rebuild();
  }

  public rebuild(list: NestedSetNode[] = []): NestedSetNode[] {
    if (list.indexOf(this) === -1) {
      if (this.parent) {
        let myIdx = this.parent.children.indexOf(this);
        if (myIdx === 0) {
          this.left = this.parent.left + 1;
        } else if (myIdx > 0) {
          this.left = this.parent.children[myIdx - 1].right + 1;
        }
      } else {
        this.left = 0;
      }
      list.push(this);
    }

    if (!this.isLeaf()) {
      let tmp: NestedSetNode[] = [];
      tmp = this.children.reduce((accumulator, child) => {
        if (accumulator.length === 0 && list.indexOf(child) === -1) {
          accumulator.push(child);
        }
        return accumulator;
      }, tmp);

      if (tmp.length === 1) {
        this.right = this.left + this.getSize() - 1;
        return tmp[0].rebuild(list);
      }
    }

    if (this.isRoot()) {
      this.right = this.left + this.getSize() - 1;
      return list;
    } else {
      let sibling = this.nextSibling();
      this.right = this.left + this.getSize() - 1;
      return sibling ? sibling.rebuild(list) : (this.parent as NestedSetNode).rebuild(list);
    }
  }

  public toNestedSetProperties(): NestedSetProperties {
    return {
      depth: this.depth,
      left: this.left,
      right: this.right,
      title: this.title,
      detail: this.detail
    };
  }

  public flat(): NestedSetProperties[] {
    return this.rebuild().map((node) => node.toNestedSetProperties());
  }

  public removeChild(child: NestedSetNode) {
    let idx = this.children.indexOf(child);
    if (idx > -1) {
      this.children.splice(idx, 1);
      child.parent = null;
      this.rebuild();
    }
  }

  public validate(): void {
    if (this.depth !== 0 && this.parent === null) {
      throw new Error('Required parent when depth is not zero.');
    }
    if (this.parent !== null) {
      if (this.parent.left >= this.left) {
        throw new Error('Node left property cannot be lower than or equals to its parent left property.');
      }
      if (this.parent.right <= this.right) {
        throw new Error('Node right property cannot be greater than or equals to its parent right property.');
      }
      if (this.parent.depth + 1 !== this.depth) {
        throw new Error('Node depth property must be exactly plus-one of its parent depth property.');
      }
    }
  }

  public getParent(): NestedSetNode | null {
    return this.parent;
  }

  public static getTree(treeData: any): NestedSetNode {
    function createNode(data: any, parent?: NestedSetNode): NestedSetNode {
      const node = new NestedSetNode(
        data.title,
        0, // Initial depth; will be updated by rebuild
        data.detail,
        parent
      );

      if (data.children && data.children.length > 0) {
        data.children.forEach((childData: any) => {
          createNode(childData, node);
        });
      }
      return node;
    }

    const rootNode = createNode(treeData);
    rootNode.rebuild();
    return rootNode;
  }
}
