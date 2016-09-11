import React from 'react';
import io from 'socket.io-client';
import $ from 'jquery';
import logo from './logo.svg';
import './App.css';

/**
 * config api url
 */
var api = {
  getRanking: 'http://localhost:5000/ranking'
};

/**
 * Socket client
 */
var socket = io.connect("http://localhost:5000");

/**
 * Save list ranking
 */
var xRank = [];

/**
 * Component display row of table
 */
var RankRow = React.createClass({
    render(){
        var d = this.props.rank;
        return (
            <tr>
                <td className='text-left'>{d.username}</td>
                <td>{d.q1}</td>
                <td>{d.q2}</td>
                <td>{d.q3}</td>
                <td>{d.q4}</td>
                <td>{d.total}</td>
            </tr>
        );
    }
});

/**
 * Component display table of ranking
 */
var Ranking = React.createClass({
   /**
    * Sort ranking by total
    */
    sortRanking(){
      xRank.sort(function(a ,b){
          if(a.total === b.total){
              return 0;
          }
          return a.total < b.total?1:-1;
      });
    },

    /**
     * Update ranking on change
     */
    updateRank(data){
      xRank.forEach(function(rank, i){
        if(data.username === rank.username){
          for(var k in rank){
            if(k === data.question){
              xRank[i][k] = data.grade;
              xRank[i].total = xRank[i].q1 + xRank[i].q2 + xRank[i].q3 + xRank[i].q4;
              return;
            }
          }
        }
      });

      this.sortRanking();
      this.setState({
          data: xRank
      });
    },

    /**
     * Init data on load
     */
    getInitialState(){
        var self = this;
        socket.on("update ranking", function(d){
          self.updateRank(d);
        });
        return {data: []};
    },

    /**
     * componentWillMount
     */
    componentWillMount(){
      var self = this;
      $.get(api.getRanking, null, function(res){
        xRank = res.data;
        self.sortRanking();
        self.setState({data: xRank});
      });
    },

    /**
     * componentDidMount
     */
    componentDidMount(){
        this.sortRanking();
        this.setState({
            data: xRank
        });
    },

    /**
     * Render component
     */
    render() {
        var rows = [];
        this.state.data.forEach(function(rank){
            rows.push(<RankRow rank={rank} key={rank.username}/>);
        });
        return (
            <div className='ranking-list'>
              <h3> Ranking List </h3>
              <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Question 1</th>
                            <th>Question 2</th>
                            <th>Question 3</th>
                            <th>Question 4</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
              </table>
          </div>
        );
    }
});

/**
 * Component App
 */
var App = React.createClass({
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Ranking />
      </div>
    );
  }
});

export default App;
