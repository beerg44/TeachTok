import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View, Image, Dimensions, Pressable, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons'; 
import { useRef } from 'react';
import React from 'react';

var DATA: any[] = [];

const { width, height } = Dimensions.get('window');
const answered: number[] = [];
const animatedColors = new Map<string, any>();
const duration = 500;

function checkAnswer(id: string, qId: number, toAnimateCorrect: any, toAnimateIncorrect: any){
  if(answered.includes(qId)){
    return;
  }

  fetch('https://cross-platform.rp.devfactory.com/reveal?id='+qId)
    .then(response => response.json())
    .then(data => {
      var correct = data.correct_options[0]["id"];
      answered.push(qId);

      var to = 1;
      var insertId = id + "" + qId;
      var correctId = correct + "" + qId;
      var toAnimate = toAnimateCorrect;
    
      if(id != correct){
        toAnimate = toAnimateIncorrect;
        Animated.sequence([
          Animated.timing(animatedColors.get(correctId), {
              toValue: to,
              duration: duration,
              useNativeDriver: true,
          }),
        ]).start()
        to = -1;
      }
    
      Animated.sequence([
          Animated.timing(animatedColors.get(insertId), {
              toValue: to,
              duration: duration,
              useNativeDriver: true,
          }),
          Animated.timing(toAnimate, {
            toValue: 1,
            duration: 1,
            useNativeDriver: true,
          }),
      ]).start()
    })
    .catch(error => console.error(error));
}

function createAnswers(id: string, answer: string, qId: number){
  const animatedColor = useRef(new Animated.Value(0)).current;
  const color = animatedColor.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ["#DC5F5F66", '#FFFFFF99', '#28B18F66']
  });

  const animatedOpacityCorrect = useRef(new Animated.Value(0)).current;
  const animatedOpacityIncorrect = useRef(new Animated.Value(0)).current;

  var insertId = id + "" + qId;

  animatedColors.set(insertId, animatedColor);

  return (
    <Pressable onPress={() => checkAnswer(id, qId, animatedOpacityCorrect, animatedOpacityIncorrect)} children = {({pressed}) => (
      <Animated.View style={[answers.item, {backgroundColor: color}]}>
        <Text style={answers.text}>{answer}</Text>
        <Animated.Image style={[answers.gifCorrect, {opacity: animatedOpacityCorrect}]} source={require('../assets/correctSymbol.gif')}/>
        <Animated.Image style={[answers.gifIncorrect, {opacity: animatedOpacityIncorrect}]} source={require('../assets/incorrectSymbol.gif')}/>
      </Animated.View>
    )}/>
  );
}

const Answers = ({obj, questionId}: any) =>(
  createAnswers(obj.id, obj.answer, questionId)
);

const Item = ({obj}: any) => (
  <View style={styles.item}>

    <Image style={styles.image} source={{uri:obj.image}} />
    <View style={styles.imageOverlay} />

    <View style={styles.dataContainer}>
      
      <View style={styles.dataHeader}>

      </View>

      <View style={styles.dataBody}>
        
        <View style={dataBody.question}>
          <View style={dataBody.questionText}>
            <Text style={dataBody.title} adjustsFontSizeToFit={true}>{obj.question}</Text>
          </View>
        </View>

        <View style={dataBody.otherInfo}>
          <View style={dataBody.infoText}>
            <View>
            <FlatList
              data={obj.options}
              renderItem={({item}) => <Answers obj={item} questionId={obj.id} />}
            />
            </View>
            <View style={dataBody.userInfo}>
              <Text style={dataBody.userInfoName}>{obj.user.name}</Text>
              <Text style={dataBody.userInfoDescription}>{obj.description}</Text>
            </View>
          </View>
          <View style={dataBody.infoActions}>
            <View style={dataBody.avatar}>
              <Image style={dataBody.avatarImage} source={{uri:obj.user.avatar}} />
              <View style={dataBody.avatarImagePlus}>
                <Text style={dataBody.avatarImagePlusText}> + </Text>
              </View>
              
            </View>
            <View style={dataBody.iconButton}>
              <FontAwesome name={"heart"} color="#FFFFFF" size={34}/>
              <Text style={dataBody.iconButtonInfo}>87</Text>
            </View>
            <View style={dataBody.iconButton}>
              <FontAwesome name={"commenting"} color="#FFFFFF" size={34}/>
              <Text style={dataBody.iconButtonInfo}>2</Text>
            </View>
            <View style={dataBody.iconButton}>
              <FontAwesome name={"bookmark"} color="#FFFFFF" size={34}/>
              <Text style={dataBody.iconButtonInfo}>203</Text>
            </View>
            <View style={dataBody.iconButton}>
              <FontAwesome name={"share"} color="#FFFFFF" size={34}/>
              <Text style={dataBody.iconButtonInfo}>17</Text>
            </View>
          </View>
        </View>
      </View>

    </View>

    <View style={styles.dataFooter}>
      <View style={footer.footerData}>
        <Ionicons name={"logo-youtube"} color="#FFFFFF" size={18}/>
        <Text style={footer.playlistText}>Playlist • Unit 5: {obj.playlist}</Text>
      </View>  
      <Ionicons style={footer.buttonArrow} name={"arrow-forward"} color="#FFFFFF" size={18}/>
    </View>
  </View>
);

class HomeTab extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {isRefresh: true, shownQuestions: [], startTime: Date.now(), timer: "0s"};
    this.getData();
  }

  componentDidMount(): void {
    this.startTimer();
  }

  startTimer = () => {
      let interval: any = null;
      interval = setInterval(() => {
        this.setState({
          timer: this.getTime()
        })
      }, 1000);
      
      return () => clearInterval(interval);
  }

  getData = () => {
    fetch('https://cross-platform.rp.devfactory.com/for_you')
    .then(response => response.json())
    .then(data => {
      if(this.state.shownQuestions.includes(data.id)){
        this.getData();
      }else{
        DATA.push(data)
        this.setState({
          shownQuestions: [...this.state.shownQuestions, data.id]
        })
      }
      if(DATA.length > 1){
        this.setState({
          isRefresh: !this.state.isRefresh
        })
      }else{
        this.getData();
      }
    })
    .catch(error => console.error(error));
  }

  getTime = () => {
    var time = Date.now() - this.state.startTime;
    var timeText = "s";
    time = Math.floor((time / 1000));
    if(time > 60){
      time = Math.floor((time) / 60)
      timeText = "m";
      if(time > 60)
      {
        Math.floor((time) / 60)
        timeText = "h";
      }
    }
    return time + "" + timeText;
  }
  
  render(){
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={({item}) => <Item obj={item} />}
          snapToAlignment='start'
          snapToInterval={height - 49}
          extraData={this.state.isRefresh}
          onEndReached={this.getData}
          onEndReachedThreshold={.5}
        />
        <View style={styles.header}>
          <View style={dataHeader.dataHeaderLeft}>
            <Ionicons name={"time"} color="#FFFFFF99" size={18}/>
            <Text style={dataHeader.timerText}>{this.state.timer}</Text>
          </View>
          <View style={dataHeader.dataHeaderMiddle}>
            <Text style={dataHeader.forYouText}>For You</Text>
          </View>
          <View style={dataHeader.dataHeaderRight}>
            <Ionicons name={"search"} color="#FFFFFF" size={20}/>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const answers = StyleSheet.create({
  item:{
    marginBottom: 10,
    borderRadius: 5,
    display:"flex",
    flexDirection:'row',
    alignItems: 'center',
  },

  text:{
    width: "75%",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 20,
    margin: 15,
    marginRight: 0,
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: { 
      width: 1,
      height: 1,
    },
  },

  gifCorrect:{
    position: "absolute",
    right: 0,
    bottom: 0,
    width:"25%",
    height:undefined,
    aspectRatio: 1,
    transform:[{rotateY: '180deg'}],
  },

  gifIncorrect:{
    position: "absolute",
    right: 0,
    top: 0,
    width:"25%",
    height:undefined,
    aspectRatio: 1,
    transform:[{rotate: '180deg'}],
  }

})

const footer = StyleSheet.create({
  footerData:{
    width:"95%",
    display:"flex",
    flexDirection:'row',
    alignItems: "center",
  },

  playlistText:{
    fontSize: 13,
    color:"#FFFFFF",
    fontWeight: "500",
    marginLeft: 5,
  },

  buttonArrow:{
    width:"5%",
  },
})

const dataHeader = StyleSheet.create({
  dataHeaderLeft:{
    display:"flex",
    flexDirection:'row',
    width: "20%",
    height: "100%",
    alignItems: 'center',
  },

  dataHeaderMiddle:{
    display:"flex",
    flexDirection:'row',
    width: "60%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },

  dataHeaderRight:{
    display:"flex",
    flexDirection:'row',
    width: "20%",
    height: "100%",
    alignItems: 'center',
    justifyContent: "flex-end"
  },

  timerText:{
    fontSize: 14,
    color:"#FFFFFF99",
    marginLeft: 2,
  },

  forYouText:{
    fontSize: 16,
    color:"#FFFFFF",
    fontWeight: "500",
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 3,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2,
  },
})

const dataBody = StyleSheet.create({  
  question:{
    marginTop: "7%",
    height: "25%"
  },

  otherInfo:{
    display:"flex",
    flexDirection:'row',
    alignItems: "flex-end",
    width: "100%",
    height: "70%",
    paddingBottom: 15,
  },
  
  title: {
    fontSize: 22,
    color: "#FFFFFF",
    lineHeight: 40,
    marginHorizontal: 5
  },

  questionText:{
    backgroundColor: "#00000099",
    alignSelf: "baseline",
    borderRadius: 10,
  },

  infoText:{
    width: "85%",
    paddingRight: 10,
  },

  userInfo:{
    width: "100%",
  },

  userInfoName:{
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 24
  },

  userInfoDescription:{
    color: "white",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 24
  },

  infoActions:{
    width: "15%",
    display:"flex",
  },

  avatar:{
    height:"20%",
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButton:{
    height:"20%",
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButtonInfo:{
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  avatarImage:{
    width:"80%",
    height:undefined,
    aspectRatio: 1,
    borderRadius: 50,
    borderColor: "white",
    borderWidth: 2,
  },

  avatarImagePlus:{
    height:18,
    width:18,
    position:"absolute",
    bottom:5,
    backgroundColor: "#28B18F",
    borderRadius:50,
    alignItems: "center",
    justifyContent: 'center',
  },

  avatarImagePlusText:{
    color:"white",
    fontSize: 14,
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  item: {
    width: width,
    height: height - 49,
  },

  dataContainer:{
    flex: 1,
    width: "100%",
    height: "95%",
    paddingHorizontal: "3%",
    marginTop: StatusBar.currentHeight || 0,
  },

  dataHeader:{
    width: "100%",
    height: "8%",
    display:"flex",
    flexDirection: "row",
  },  

  header:{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "8%",
    display:"flex",
    flexDirection: "row",
    paddingHorizontal: "3%",
    marginTop: StatusBar.currentHeight || 0,
  }, 

  dataBody:{
    width: "100%",
    height: "92%",
  },

  dataFooter:{
    width: "100%",
    height: "5%",
    backgroundColor: "#161616",
    display:"flex",
    flexDirection:'row',
    alignItems: "center",
    paddingHorizontal: 10,
  }, 

  image:{
    position: "absolute",
    top: 0,
    left: 0,
    width:"100%",
    height:"100%",
  },

  imageOverlay:{
    position:"absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#00000073",
  },
});

export default HomeTab