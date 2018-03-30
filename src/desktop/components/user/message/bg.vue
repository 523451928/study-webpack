<template>
  <div id="profile-tab-menu" class="profile-left-menu col-md-2">
    <ul class="list-unstyled profile-menu-list">
      <router-link to="system" tag="li">
        <a href="/user/message.html#/system">系统消息</a>
      </router-link>
      <router-link to="comment" tag="li">
        <a href="/user/message.html#/comment">评论回复</a>
      </router-link>
      <router-link to="foucslike" tag="li">
        <a href="/user/message.html#/foucslike">关注/喜欢</a>
      </router-link>
      <router-link to="order" tag="li">
        <a href="/user/message.html#/order">订单消息</a>
      </router-link>
    </ul>
  </div>
</template>
