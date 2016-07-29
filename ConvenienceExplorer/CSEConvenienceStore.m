//
//  CSEConvenienceStore.m
//  ConvenienceExplorer
//
//  Created by hirauchi.shinichi on 2016/07/28.
//  Copyright © 2016年 SAPPOROWORKS. All rights reserved.
//

#import "CSEConvenienceStore.h"

@implementation CSEConvenienceStore

- (id)initWithJson:(NSDictionary *)json
{
    self = [super init];
    if (self) {
        _name = json[@"name"];
        _vicinity = json[@"vicinity"];
        NSDictionary *geometry = json[@"geometry"];
        NSDictionary *location = geometry[@"location"];
        _latitude = [location[@"lat"] floatValue];
        _longitude = [location[@"lng"] floatValue];

        NSRange range = [_name rangeOfString:@"セイコーマート"];
        if (range.location != NSNotFound) {
            //_name = [_name substringFromIndex:range.length];
            _grouping = GroupingSeicomart;
        }
        else {
            range = [_name rangeOfString:@"ローソン"];
            if (range.location != NSNotFound) {
                //_name = [_name substringFromIndex:range.length];
                _grouping = GroupingLowson;
            }
            else{
                range = [_name rangeOfString:@"セブンイレブン"];
                if (range.location != NSNotFound) {
                    //_name = [_name substringFromIndex:range.length];
                    _grouping = GroupingSeveneleven;
                }
                else {
                    range = [_name rangeOfString:@"セブン−イレブン"];
                    if (range.location != NSNotFound) {
                        //_name = [_name substringFromIndex:range.length];
                        _grouping = GroupingSeveneleven;
                    }
                    else{
                        range = [_name rangeOfString:@"ファミリーマート"];
                        if (range.location != NSNotFound) {
                            //_name = [_name substringFromIndex:range.length];
                            _grouping = GroupingFamilymart;
                        }
                        else{
                            range = [_name rangeOfString:@"サンクス"];
                            if (range.location != NSNotFound) {
                                //_name = [_name substringFromIndex:range.length];
                                _grouping = GroupingSanks;
                            }
                        }
                    }
                }
            }
        }
        // 「・」の削除
        range = [_name rangeOfString:@"・"];
        if (range.location != NSNotFound) {
            _name = [_name substringFromIndex:range.length];
        }
        // 空白削除
        _name = [_name stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];

    }
    return self;
}

- (NSString *)distanceStr
{
    if (self.distance > 1000) {
        return [NSString stringWithFormat:@"%.1fKm",self.distance/1000];
    }
    return [NSString stringWithFormat:@"%.0fm",self.distance];
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"%f %f altitude=%f distance=%.0f %@ name=%@ gouping=%ld",self.longitude, self.latitude, self.altitude, self.distance, self.distanceStr, self.name, self.grouping];
}

@end
