//
//  CSEConvenienceStoreRepository.m
//  ConvenienceExplorer
//
//  Created by hirauchi.shinichi on 2016/07/28.
//  Copyright © 2016年 SAPPOROWORKS. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import "CSEConvenienceStoreRepository.h"
#import "CSEConvenienceStore.h"
#import "AFNetworking.h"
#import "SecretKey.h"


@interface CSEConvenienceStoreRepository ()

@property (nonatomic,strong) NSMutableArray<CSEConvenienceStore *> *convenienceStores; // 外部公開用
@property (nonatomic,strong) NSMutableArray<CSEConvenienceStore *> *beforeResults; // 検索中に前のデータを保存する
@property (nonatomic) float radius; // 当初300m範囲内で検索する
@property (nonatomic) NSInteger mode; // スタート:0 範囲を拡大:1 範囲を縮小:-1
@property (nonatomic) float latitude;
@property (nonatomic) float longitude;
@property (nonatomic) float altitude;
@property (nonatomic) NSInteger counter; // 再起検索は回まで

@end

@implementation CSEConvenienceStoreRepository

- (id)init
{
    self = [super init];
    if (self) {
        _convenienceStores = [[NSMutableArray alloc] init];
        _isBusy = false;
    }
    return self;
}

- (NSString *) jsonData
{
    NSMutableString *str = [NSMutableString string];
    [str appendString: @"{\"convenienceStores\":["];
    bool farst = true;
    for (CSEConvenienceStore *convenienceStore in _convenienceStores)
    {
        if(!farst)
        {
            [str appendString: @","];
        }
        NSString *json = [NSString stringWithFormat:@"{  \"name\": \"%@\", \"latitude\": %f, \"longitude\": %f, \"altitude\": %f, \"distance\":\"%@\", \"grouping\": %ld }"
                          ,convenienceStore.name, convenienceStore.latitude, convenienceStore.longitude, convenienceStore.altitude, convenienceStore.distanceStr, convenienceStore.grouping];

        [str appendString: json];
        farst = false;
    }
    [str appendString: @"]}"];
    return str;
}

- (void) refreshWithLocation :(float)latitude :(float)longitude :(float)altitude
{

    if (_isBusy) {
        NSLog(@"Do not process because it is during the search ....");
        return;
    }
    self.altitude = altitude;
    self.isBusy = true;
    self.counter = 0;
    self.mode = 0;
    self.latitude = latitude;
    self.longitude = longitude;
    self.radius = 300; // 当初半径300ｍで検索する
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0);
    dispatch_async(queue, ^{
        [self searchConvenienceStore]; // 検索範囲を変えながら再起的に2検索する
    });
}

- (void) searchConvenienceStore
{
    NSMutableArray<CSEConvenienceStore *> *results = [[NSMutableArray alloc] init];
    self.counter++;
    if (self.counter > 3) {
        // １つ前のデータとマージして公開用のデータを作成する
        [self finishSearch:results];
        return;
    }

    NSLog(@"◼︎Google Place nearbysearch mode=%ld radius=%.0fm",(long)_mode,_radius);
    NSString *url = [NSString stringWithFormat:@"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%f,%f&radius=%ld&types=convenience_store&key=%@",_latitude,_longitude,(long)_radius,GOOGLE_PLACE_API_KEY];

    AFHTTPSessionManager *httpSessionManager = [AFHTTPSessionManager manager];
    [httpSessionManager GET:url parameters:nil progress:nil
                    success:^(NSURLSessionTask *task, id responseObject) {

                        NSDictionary *dic = (NSDictionary*)responseObject;
                        NSArray *ar = dic[@"results"];
                        for( NSInteger i =0; i<ar.count; i++) {
                            CSEConvenienceStore *result = [[CSEConvenienceStore alloc] initWithJson:ar[i]];
                            float distance = [self distanceWithLocation:result.latitude :result.longitude];
                            result.distance = distance;
                            result.altitude = self.altitude;
                            NSLog(@"%ld %@ %.0fm",(long)i,result.name,distance);
                            [results addObject:result];
                        }
                        if (ar.count >= 20) {
                            if (self.mode == 1) {
                                [self finishSearch:results];
                            }
                            else {
                                self.radius /= 2;

                                if (_radius < 10) { // 10m以下は検索しない
                                    [self finishSearch:results];
                                }
                                else {
                                    self.mode = -1;
                                    // １つ前の検索データを保存しておく
                                    [self keepResults:results];
                                    // 再起処理
                                    [self searchConvenienceStore];
                                }
                            }
                        }
                        else {
                            if (self.mode == -1) {
                                [self finishSearch:results];
                            }
                            else {
                                self.radius *= 2;
                                if (_radius > 10000) { // 10km以上は検索しない
                                    [self finishSearch:results];
                                }
                                self.mode = 1;
                                // １つ前の検索データを保存しておく
                                [self keepResults:results];
                                // 再起処理
                                [self searchConvenienceStore];
                            }
                        }

                    } failure:^(NSURLSessionTask *operation, NSError *error) {
                        // エラーの場合の処理
                        NSLog(@"%@",error);
                    }
     ];
}

// １つ前の検索データを保存しておく
- (void) keepResults: (NSArray<CSEConvenienceStore *> *)results
{
    _beforeResults = [[NSMutableArray alloc] init];
    for (CSEConvenienceStore *result in results){
        [_beforeResults addObject:result];
    }
}

- (void) finishSearch: (NSArray<CSEConvenienceStore *> *)results
{
    // １つ前のデータとマージして公開用のデータを作成する
    _convenienceStores = [[NSMutableArray alloc] init];
    for (CSEConvenienceStore *beforeResult in _beforeResults){ // 前の検索データをマージする
        bool find = false;// 今回に同じデータが無いものだけ公開用にコピーする
        for (CSEConvenienceStore *result in results){
            if ([result.name isEqualToString:beforeResult.name]){
                find = true;
                break;
            }
        }
        if(!find)
        {
            [_convenienceStores addObject:beforeResult];
        }
    }
    for (CSEConvenienceStore *result in results){ // 今回の検索データを公開用にコピーする
        [_convenienceStores addObject:result];
    }
    // 距離でソート

    //ソート対象となるメンバ変数をキーとして指定した、NSSortDescriptorの生成
    NSSortDescriptor *sortDescNumber = [[NSSortDescriptor alloc] initWithKey:@"distance" ascending:YES];

    // NSSortDescriptorは配列に入れてNSArrayに渡す
    NSArray *sortDescArray = [NSArray arrayWithObjects:sortDescNumber, nil];

    // 近くの１０件を厳選する(ソート)
    NSArray<CSEConvenienceStore*> *sortArray = [_convenienceStores sortedArrayUsingDescriptors:sortDescArray];
    self.convenienceStores = [[NSMutableArray alloc] init];
    for( NSInteger i =0; i < sortArray.count && i < 10; i++)
    {
        [self.convenienceStores addObject:[sortArray objectAtIndex:i]];
    }
    _beforeResults = [[NSMutableArray alloc] init];
    self.isBusy = false;

    for (CSEConvenienceStore *c in self.convenienceStores){
        NSLog(@"%@",c);
    }
    NSNotification *n = [NSNotification notificationWithName:@"SearchFinish" object:self];
    [[NSNotificationCenter defaultCenter] postNotification:n];
}

// 距離の計算
- (float) distanceWithLocation:(float)latitude :(float)longitude
{
    CLLocation *a = [[CLLocation alloc] initWithLatitude:_latitude longitude:_longitude];
    CLLocation *b = [[CLLocation alloc] initWithLatitude:latitude longitude:longitude];
    CLLocationDistance distance = [a distanceFromLocation:b];
    return distance;
}

@end
