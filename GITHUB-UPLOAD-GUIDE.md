# 上传代码到 GitHub 完整指南

本指南将一步步教你如何将博客代码上传到 GitHub。

---

## 📋 准备工作

### 1. 安装 Git

#### 方法一: 下载安装包(推荐)

1. **下载 Git**
   - 访问官网: https://git-scm.com/download/win
   - 或者国内镜像: https://npm.taobao.org/mirrors/git-for-windows/
   - 下载最新版本的 Git-x.xx.x-64-bit.exe

2. **安装 Git**
   - 双击安装包
   - 一路点击 "Next"(保持默认设置即可)
   - 重要选项:
     - ✅ 选择 "Git from the command line and also from 3rd-party software"
     - ✅ 选择 "Use Windows' default console window"
   - 点击 "Install" 完成安装

3. **验证安装**
   
   打开新的 PowerShell 窗口,输入:
   ```bash
   git --version
   ```
   
   如果显示版本号(如 `git version 2.xx.x`),说明安装成功!

#### 方法二: 使用 winget(如果有)

```bash
winget install --id Git.Git -e --source winget
```

### 2. 配置 Git(首次使用必须)

安装完 Git 后,需要配置你的用户信息:

```bash
# 设置用户名(将替换为你的 GitHub 用户名)
git config --global user.name "你的用户名"

# 设置邮箱(将替换为你的 GitHub 邮箱)
git config --global user.email "your-email@example.com"
```

### 3. 注册 GitHub 账号

如果还没有 GitHub 账号:

1. 访问 https://github.com
2. 点击右上角 "Sign up"
3. 填写用户名、邮箱、密码
4. 验证邮箱
5. 完成注册

---

## 🚀 上传代码步骤

### 步骤 1: 初始化 Git 仓库

在项目目录下执行:

```bash
# 进入项目目录
cd d:\下载\桌面\新建文件夹\my-blog

# 初始化 Git 仓库
git init
```

### 步骤 2: 检查 .gitignore 文件

确保项目根目录有 `.gitignore` 文件,内容应该包含:

```
# dependencies
node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode
.idea
```

如果没有,项目中已经包含了这个文件。

### 步骤 3: 添加所有文件

```bash
# 添加所有文件到暂存区
git add .

# 查看状态
git status
```

### 步骤 4: 提交代码

```bash
# 提交代码
git commit -m "Initial commit: My blog project"
```

### 步骤 5: 在 GitHub 创建远程仓库

1. **登录 GitHub**
   - 访问 https://github.com
   - 登录你的账号

2. **创建新仓库**
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"

3. **填写仓库信息**
   - **Repository name**: `my-blog` (或你喜欢的名字)
   - **Description**: "我的个人博客" (可选)
   - **Public/Private**: 选择 Public(公开) 或 Private(私有)
   - ⚠️ **不要**勾选 "Initialize this repository with a README"
   - ⚠️ **不要**添加 .gitignore 和 license(我们已经有了)
   - 点击 "Create repository"

4. **复制仓库地址**
   
   创建完成后,会看到仓库 URL,有两种格式:
   - HTTPS: `https://github.com/你的用户名/my-blog.git`
   - SSH: `git@github.com:你的用户名/my-blog.git`
   
   **推荐使用 HTTPS**(更简单)

### 步骤 6: 关联远程仓库

```bash
# 关联远程仓库(替换 URL 为你的仓库地址)
git remote add origin https://github.com/你的用户名/my-blog.git

# 设置主分支名称
git branch -M main
```

### 步骤 7: 推送代码

```bash
# 推送代码到 GitHub
git push -u origin main
```

第一次推送时,会弹出登录窗口:
- 输入你的 GitHub 用户名
- 输入你的密码(或 Personal Access Token)

**注意**: GitHub 已不再支持密码登录,需要使用 Personal Access Token:

#### 创建 Personal Access Token:

1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧菜单最下方 → Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token → Generate new token (classic)
6. 填写信息:
   - Note: "My Blog Upload"
   - Expiration: 90 days 或 No expiration
   - 勾选 `repo` (完整权限)
7. 点击 "Generate token"
8. **复制 Token**(只显示一次,务必保存!)
9. 在推送时,使用 Token 作为密码

---

## ✅ 验证上传成功

1. 刷新 GitHub 仓库页面
2. 应该能看到所有代码文件
3. README.md 会自动显示在仓库首页

---

## 🔄 后续更新代码

当你修改了代码,想要更新到 GitHub:

```bash
# 1. 查看修改
git status

# 2. 添加修改的文件
git add .

# 3. 提交
git commit -m "描述你的修改内容"

# 4. 推送
git push
```

---

## 🎯 常用 Git 命令

```bash
# 查看状态
git status

# 查看提交历史
git log

# 查看简洁的提交历史
git log --oneline

# 查看远程仓库信息
git remote -v

# 撤销工作区的修改
git checkout -- 文件名

# 撤销暂存区的文件
git reset HEAD 文件名

# 拉取远程最新代码
git pull
```

---

## ❓ 常见问题

### 1. 推送失败: "failed to push some refs"

**原因**: 远程仓库有本地没有的内容

**解决**:
```bash
# 先拉取远程代码
git pull origin main --allow-unrelated-histories

# 解决冲突(如果有)
# 然后重新推送
git push -u origin main
```

### 2. 认证失败

**原因**: 密码不正确或未使用 Token

**解决**: 使用 Personal Access Token 而不是密码

### 3. 文件太大无法上传

**原因**: GitHub 限制单个文件 100MB

**解决**:
```bash
# 查找大文件
git ls-files | xargs ls -lh | sort -k5 -h -r | head -10

# 从 Git 中移除
git rm --cached 大文件名

# 添加到 .gitignore
echo "大文件名" >> .gitignore
```

### 4. 忘记添加 .gitignore,node_modules 已提交

**解决**:
```bash
# 从 Git 中移除 node_modules
git rm -r --cached node_modules

# 提交
git commit -m "Remove node_modules"

# 推送
git push
```

---

## 🎓 Git 基础概念

- **工作区**: 你电脑上的项目文件夹
- **暂存区**: `git add` 后的临时存储区
- **本地仓库**: `git commit` 后的版本历史
- **远程仓库**: GitHub 上的仓库

**流程**:
```
工作区 → (git add) → 暂存区 → (git commit) → 本地仓库 → (git push) → 远程仓库
```

---

## 📚 推荐学习资源

- Git 官方文档: https://git-scm.com/doc
- GitHub 官方文档: https://docs.github.com
- 廖雪峰 Git 教程: https://www.liaoxuefeng.com/wiki/896043488029600

---

## 🚀 下一步: 部署到 Vercel

代码上传到 GitHub 后,就可以部署到 Vercel 了!

查看 [`DEPLOYMENT.md`](./DEPLOYMENT.md) 文档中的 "Vercel 部署" 部分。

---

祝你上传成功! 🎉

如有问题,欢迎查阅文档或寻求帮助。
