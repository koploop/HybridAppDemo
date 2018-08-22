/**
 *  首页 - 正在热映
 */

import React, { Component } from 'react';
import { 
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';
import Star from './common/Star';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';

export default class HotMovies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: true,
      refreshing: false,
      movies: []
    };
  }

  /**
   * 组件加载完成时触发
   * 在这里setState会触发重新渲染
   */
  componentDidMount() {
    this._fetchData();
  }

  /**
   * 获取数据
   * 业界通用JS私有变量的命名方法是下划线+变量名
   */
  _fetchData = () => {
    fetch('https://api.douban.com/v2/movie/in_theaters')
      .then((response) => {
        this.setState({refreshing: false});
        return response.json();

      }).then((responseText) => {
        let arrayData = responseText.subjects; // key: subjects
        let i = 0;
        let arrList = [];
        arrayData.map(item => {
          arrList.push({key: i, value: item});
          i++;
        })

        this.setState({
          movies: arrList, 
          ready: true, 
          refreshing: false
        });
        
      }).catch((error) => {
        console.log(error);
      });
  }

  /**
   * 刷新数据
   */
  _refreshData = () => {
    this.setState({refreshing: true});
    this._fetchData();
  }

  /**
   * item view
   */
  _renderItem = (item) => {
    return (
      // item可点击
      <TouchableOpacity 
        style = {[
          styles.hotList, 
          item.key + 1 == movies.length && styles.lastList
        ]}
        onPress = {() => navigate('Detail', {
          id: item.value.id;
          callback: (data) => {
          this.setState({childState: data})
          }
        })}
      >
        {/* 左侧大图 */}
        <View style = {{flex: 1}}>
          <Image style = {{
            width: 80,
            height: 100
            }}
            source = {{
              uri: item.value.images.large.replace('webp', 'png')
          }}
          />
        </View>

        {/* 右侧父视图 */}
        <View style = {{
          flex: 2,
          alignItems: 'flex-start'
        }}>
          {/* 标题 */}
          <Text style = {styles.title}>{item.value.title}</Text>
          {/* 星星 */}
          <View style = {{marginTop: 3, marginBottom: 3}}>
            <Star value = {item.value.rating.stars}></Star>
          </View>
          {/* 导演 */}
          <Text style = {styles.smallFont}>导演：{item.value.director[0].name}</Text>
          <Text style = {styles.smallFont}>主演：{item.value.casts.map((v) => v.name).join('/')}</Text>
          {/* 多少人看过 */}
          <Text style = {{
            lineHeight: 20,
            fontSize: 13
            }}>{item.value.collect_count}人看过
          </Text>
        </View>
        <View style = {{flex: 0}}>
          <TouchableOpacity 
          style = {styles.pay}
          onPress = {() => alert('购票')}>
            <Text style = {{
              color: '#FF4E65',
              fontWeight: '900'
            }}>购票</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
  
   render() {
     const {navigate} = this.props.navigate;
     const {movies} = this.state;
    return (
      <View>
        {
          this.state.ready
          ? <ActivityIndicator size='large',style={styles.loadding} />
          : <FlatList
          data = {movies}
          onRefresh = {this._refreshData}
          refreshing = {this.state.refreshing}
          key = {movies.key}
          // renderItem: (info: {item: ItemT, index: number}) => ?React.Element<any>
          // ES6的解构赋值，movie包含了item这个value，使用{item}即可获取
          // renderItem = {({item}) => this._renderItem(item)}
          // 简化写法
          renderItem = {this._renderItem}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  smallFont: {
    lineHeight: 20,
    color: '#A6A6A6',
    fontSize: 12
  },
  loadding: {
    marginTop: 100
  },
  star: {
    width: 12,
    height: 12,
    marginRight: 2
  },
  hotList: {
    height: 130,
    paddingLeft: 18,
    paddingRight: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF'
  },
  lastList: {
    borderBottomWidth: 0
  },
  title: {
    fontWeight: '900',
    fontSize: 15
  },
  pay: {
    width: 50,
    height: 25,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:'#FF4E65',
    borderRadius:5,
  }
})