<template>
    <div class="follow-list">
        <loadmore :noMoreText="noMoreText" :top-method="loadTop" :bottom-method="getFollowList" :all-bottom-loaded="allLoaded"
                ref="loadmore">
            <div>
                <ul>
                    <a  v-for="(item, index) in followList" :href="`/artist/${item.Id}`">
                        <li class="follow-item">
                            <img :src="item.Avatar">
                            <span>{{item.Nickname}}</span>
                        </li>
                    </a>
                </ul>
            </div>
        </loadmore>
    </div>
</template>

<script>
    /* eslint-disable */
    import loadmore from 'components/public/loadmore'
    export default {
        props: {
            isFollow: {
                type: Boolean,
                default: true
            }
        },
        components: {
            loadmore
        },
        data() {
            return {
                followList: [],
                pageId: 1,
                allLoaded: false,
                noMoreText: '没有更多了!'
            }
        },
        mounted() {
            // this.getFollowList()
        },
        methods: {
            loadTop() {
                setTimeout(() => {
                    this.$refs.loadmore.onTopLoaded()
                }, 1000)
            },
            getFollowList() {
                let params = {
                    'Page': this.pageId,
                    'Passive': false
                }
                if (!this.isFollow) {
                    params.Passive = true
                }
                this.allLoaded = true
                request({url: 'follow/list', params}).then(res => {
                    let data = res.take('Data')
                    if (!res.take('Data')) {
                        data = []
                    }
                    if (data.length >= res.take('Pager')['Count']) {
                        this.allLoaded = false
                        this.pageId++
                    }
                    this.followList = this.followList.concat(data)
                    this.followList.forEach((item) => {
                        item['Avatar'] = item['Avatar'] ? `http://192.168.1.6:8000//thumbnail/avatar/${item['Id']}/100/${item['Avatar']}` : require('assets/images/user/default-profile.jpg')
                    })
                    if (this.followList.length === 0) {
                        if (this.isFollow) {
                            this.noMoreText = '暂无关注'
                        } else {
                            this.noMoreText = '暂无粉丝'
                        }
                    }
                    this.$refs.loadmore.onBottomLoaded()
                })
            }
        }
    }
</script>