//
//  CSEConvenienceStoreRepository.h
//  ConvenienceExplorer
//
//  Created by hirauchi.shinichi on 2016/07/28.
//  Copyright © 2016年 SAPPOROWORKS. All rights reserved.
//

#import <UIKit/UIKit.h>

/**
 近隣のコンビニの店舗情報を格納するリポジトリクラス
 */

@interface CSEConvenienceStoreRepository : NSObject

- (void) refreshWithLocation :(float)latitude :(float)longitude :(float)altitude;

- (NSString *) jsonData;
@property (nonatomic) BOOL isBusy; // 検索中

@end


