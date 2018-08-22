import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

// 你可以在根目录创建一个src文件夹，用来放置你的RN代码。这里指定一下
import HybridAppDemo from './src';

// 整体js模块的名称,在 iOS 原生代码中添加 React Native 视图时会用到这个名称。
AppRegistry.registerComponent('HybridAppDemo', () => HybridAppDemo);